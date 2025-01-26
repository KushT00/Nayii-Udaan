"use client";
import React from "react";
import Head from "next/head";

const VirtualMeetingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Virtual Meeting Space</title>
        <meta
          name="description"
          content="Join our virtual meeting space for an immersive experience."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <iframe
          src="https://framevr.io/panchayat"
          style={{
            width: "90%",
            height: "90%",
            border: "none",
            borderRadius: "10px",
          }}
          allow="vr; xr; accelerometer; gyroscope; autoplay; encrypted-media"
        ></iframe>
      </div>
    </>
  );
};

export default VirtualMeetingPage;
