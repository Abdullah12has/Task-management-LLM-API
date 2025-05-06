"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "./ui/lamp";
import { TextRevealCardPreview } from "./TextRevealDemo";
import { useEffect, useState } from 'react';
import Link from "next/link";
import axios from "axios";



export function LampDemo() {


  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-3xl"
      >
        Welcome <br /> Task Management LLM Interface



      </motion.h1>

      <motion.h2
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-l font-medium tracking-tight text-transparent md:text-xl"
      >

      </motion.h2>

      <div className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight transparenttext- md:text-7xl text-white"><Link href="/login">Let's Go</Link></div>


    </LampContainer>

  );
}
