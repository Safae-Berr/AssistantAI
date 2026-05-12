function AdminFooter() {
  return (
    <footer className="mt-16 w-full border-t border-gray-100 bg-white px-6 py-10 sm:px-10 lg:px-16 xl:mt-24">
      <div className="w-full">
        <p className="mt-10 w-full border-t border-gray-200 pt-6 text-center text-xs text-gray-400">&copy; {new Date().getFullYear()} Platform administrative. All rights reserved.</p>
        <p className="mt-4 w-full text-center text-sm text-gray-400">
          Gestions des comptes médecins et utilisateurs, validation des accès, et supervision de la plateforme.
        </p>
      </div>
    </footer>
  );
}

export default AdminFooter;