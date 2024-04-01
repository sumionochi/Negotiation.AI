"use client";
import { Bot, Rocket } from "lucide-react";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitle3 = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString(`Important Health Info.`)
          .pauseFor(1000)
          .deleteAll()
          .typeString(`Learn More About Self.`)
          .start();
      }}
    />
  );
};

export default TypewriterTitle3;