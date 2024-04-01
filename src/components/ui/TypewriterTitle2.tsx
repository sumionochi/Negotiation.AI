"use client";
import { Bot, Rocket } from "lucide-react";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitle2 = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString(`Personalized Curriculum.`)
          .pauseFor(1000)
          .deleteAll()
          .typeString(`Adaptive Quizzes.`)
          .start();
      }}
    />
  );
};

export default TypewriterTitle2;