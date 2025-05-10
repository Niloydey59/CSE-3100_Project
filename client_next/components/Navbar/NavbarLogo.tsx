import React from "react";
import Link from "next/link";

const NavbarLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600 dark:from-amber-400 dark:to-orange-500">
        StackRUET
      </span>
    </Link>
  );
};

export default NavbarLogo;
