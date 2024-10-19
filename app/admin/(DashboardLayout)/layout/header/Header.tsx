import Image from "next/image";
import React from "react";
import logo from "@/assets/fun shop-black.png";
import auth from "@/assets/auth.jpg";

const Header = () => {
  return (
    <div>
      <section className="bg-blue-400 h-20 flex justify-between px-8 items-center w-full shadow-2xl">
        <Image
          src={logo}
          alt="logo"
          width={900}
          height={900}
          className=" h-16 w-auto"
        />
        <Image
          src={auth}
          alt="Picture of the author"
          width={690}
          height={690}
          className="rounded-full h-16 w-16"
        />
      </section>
    </div>
  );
};

export default Header;
