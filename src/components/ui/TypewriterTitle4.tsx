"use client";
import { Bot, Rocket } from "lucide-react";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitle4 = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString(`Democratizing Education`)
          .pauseFor(1000)
          .deleteAll()
          .typeString(`Empowering Homeschooling`)
          .pauseFor(1000)
          .deleteAll()
          .typeString(`Fostering Self Learning`)
          .start();
      }}
    />
  );
};

export default TypewriterTitle4;