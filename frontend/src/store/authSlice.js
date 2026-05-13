// src/store/authSlice.js
//
// Redux slice for authentication.
//
// State shape:
//   {
//     status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'mfa_required',
//     user:    null | { id, email, role, first_name, last_name, speciality, ... },
//     error:   null | string,
//     pendingUserId: null | number,   // user id during MFA step 1->2 transition
//   }

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api';
// ============================================================================
// Thunks
// ============================================================================

/**
 * Called on app boot — checks if the user already has a valid session cookie.
 */
export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');
      return data;
    } catch (err) {
      // Anonymous is fine, not an error
      return rejectWithValue(err?.response?.data?.detail || 'Not authenticated');
    }
  }
);

/**
 * Step 1 of doctor/admin login.
 * - On MFA accounts: status becomes 'mfa_required'
 * - Otherwise: status becomes 'authenticated' and we fetch /me
 */

export const loginDoctor = createAsyncThunk(
  'auth/loginDoctor',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      if (data.mfa_required) {
        return {
          mfa_required: true,
          userId: data.user_id,
        };
      }
      const me = await api.get('/auth/me');
      return {
        mfa_required: false,
        user: me.data || {
          id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          role: data.role,
          mfa_enabled: data.mfa_enabled,
          is_validated: data.is_validated,
          is_active: data.is_active,
        },
      };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.detail || 'Login failed'
      );
    }
  }
);

/**
 * Step 2 of doctor/admin login (when MFA was required).
 */
export const verifyMfa = createAsyncThunk(
  'auth/verifyMfa',
  async ({ totpCode }, { rejectWithValue }) => {
    try {
      await api.post('/auth/mfa/verify', { totp_code: totpCode });
      const me = await api.get('/auth/me');
      return me.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || 'Invalid TOTP code');
    }
  }
);

/**
 * Patient login (no MFA).
 */
export const loginPatient = createAsyncThunk(
  'auth/loginPatient',
  async ({ patientCode, birthDate }, { rejectWithValue }) => {
    try {
      await api.post('/auth/login/patient', {
        patient_code: patientCode,
        birth_date: birthDate,
      });
      const me = await api.get('/auth/me');
      return me.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || 'Invalid credentials');
    }
  }
);

/**
 * Doctor self-registration.
 */
export const registerDoctor = createAsyncThunk(
  'auth/registerDoctor',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register/doctor', payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.detail || 'Registration failed'
      );
    }
  }
);

/**
 * Logout: server-side revocation + cookie clear.
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore — we clear local state anyway
  }
});

// ============================================================================
// Slice
// ============================================================================

const initialState = {
  status: 'idle',
  user: null,
  error: null,
  pendingUserId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    sessionExpired(state) {
      state.status = 'unauthenticated';
      state.user = null;
      state.pendingUserId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ----- bootstrap -----
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        if (state.status !== 'authenticated') {
          state.status = 'unauthenticated';
          state.user = null;
        }
      })

      // ----- login doctor (step 1) -----
      .addCase(loginDoctor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginDoctor.fulfilled, (state, action) => {
        if (action.payload.mfa_required) {
          state.status = 'mfa_required';
          state.pendingUserId = action.payload.userId;
        } else {
          state.status = 'authenticated';
          state.user = action.payload.user;
          state.pendingUserId = null;
          state.error = null;
        }
      })
      .addCase(loginDoctor.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload;
      })

      // ----- MFA verify (step 2) -----
      .addCase(verifyMfa.pending, (state) => {
        state.error = null;
      })
      .addCase(verifyMfa.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.pendingUserId = null;
      })
      .addCase(verifyMfa.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ----- patient login -----
      .addCase(loginPatient.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginPatient.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(loginPatient.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload;
      })

      // ----- logout -----
      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.pendingUserId = null;
        state.error = null;
      });
  },
});

export const { clearError, sessionExpired } = authSlice.actions;
export default authSlice.reducer;

// ============================================================================
// Selectors
// ============================================================================

export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectRole = (state) => state.auth.user?.role || null;
export const selectIsAuthenticated = (state) =>
  state.auth.status === 'authenticated';
