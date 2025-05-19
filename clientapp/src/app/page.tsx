"use client"
import { LampDemo } from "@/components/lampDemo";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  
  return (
    <div className="">
     
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <LampDemo />
        {/* <p onClick={fetchData}>DATA: </p> */}

      </main>

    </div>
  );
}
