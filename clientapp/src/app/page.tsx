"use client"
import { LampDemo } from "@/components/lampDemo";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState<any>(null); // or use a specific type


  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080");
      console.log('Fetching from:', process.env.NEXT_PUBLIC_BACKEND_URL);
      setData(response.data);
      console.log('Data fetched:', response.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    

    fetchData();
  }, []);

  
  return (
    <div className="">
     
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* <LampDemo /> */}
        <p onClick={fetchData}>DATA: </p>

      </main>

    </div>
  );
}
