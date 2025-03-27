"use client";

import React from "react";
import { Image } from "@heroui/image";
import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

const HeroSection = () => {
  return (
    <div className="max-w-[1200px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
      <Card className="col-span-12 sm:col-span-4 h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">What to watch</p>
          <h4 className="text-white font-medium text-large">Stream the Acme event</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://heroui.com/images/card-example-4.jpeg"
        />
      </Card>
      <Card className="col-span-12 sm:col-span-4 h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">Plant a tree</p>
          <h4 className="text-white font-medium text-large">Contribute to the planet</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://heroui.com/images/card-example-3.jpeg"
        />
      </Card>
      <Card className="col-span-12 sm:col-span-4 h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">Supercharged</p>
          <h4 className="text-white font-medium text-large">Creates beauty like a beast</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://heroui.com/images/card-example-2.jpeg"
        />
      </Card>
      <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">New</p>
          <h4 className="text-black font-medium text-2xl">Acme camera</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src="https://heroui.com/images/card-example-6.jpeg"
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className="text-black text-tiny">Available soon.</p>
            <p className="text-black text-tiny">Get notified.</p>
          </div>
          <Button className="text-tiny" color="primary" radius="full" size="sm">
            Notify Me
          </Button>
        </CardFooter>
      </Card>
      <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>
          <h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 w-full h-full object-cover"
          src="https://heroui.com/images/card-example-5.jpeg"
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex flex-grow gap-2 items-center">
            <Image
              alt="Breathing app icon"
              className="rounded-full w-10 h-11 bg-black"
              src="https://heroui.com/images/breathing-app-icon.jpeg"
            />
            <div className="flex flex-col">
              <p className="text-tiny text-white/60">Breathing App</p>
              <p className="text-tiny text-white/60">Get a good night&#39;s sleep.</p>
            </div>
          </div>
          <Button radius="full" size="sm">
            Get App
          </Button>
        </CardFooter>
      </Card>
    </div>
    // <section
    //   className="flex flex-grow max-w-[1200px] h-[260px] mt-6 mx-4 md:h-[432px] md:mx-8 md:mt-6
    //         xl:w-[1200px] xl:mx-auto xl:mt-6"
    // >
    //   <div className="relative w-full h-full opacity-100">
    //     <div className="absolute w-full h-full opacity-100 visible transition-opacity transition-visibility duration-530">
    //       <a
    //         href="#"
    //         className="grid w-full rounded-2xl grid-rows-[auto_36%] grid-areas-[image_text] md:grid-cols-[36%_auto] md:grid-areas-[text_image]"
    //       >
    //         {/* Left side content */}
    //         <div
    //           className="text-white bg-[#1b0045] grid-area-text grid grid-rows-[1fr_auto] grid-cols-1 gap-4 break-words h-[76px] p-4
    //             md:rounded-l-[24px] md:rounded-r-0 md:h-[260px] md:py-8 md:px-12 md:pl-8
    //             lg:h-[432px]"
    //         >
    //           <div className="flex flex-col gap-0 self-center h-full justify-center">
    //             <h2
    //               className="line-clamp-2 overflow-hidden text-ellipsis mb-0 text-xl font-bold leading-6
    //             md:text-2xl md:leading-7 md:tracking-[-0.5px] md:mb-4
    //             lg:text-[40px] lg:leading-[48px] lg:tracking-[-1px] lg:line-clamp-3
    //             xl:text-[48px] xl:leading-[52px] xl:tracking-[-1px]"
    //             >
    //               Sabrina Carpenter
    //             </h2>
    //             <div className="[&>*]:w-auto">
    //               <button className="font-inherit cursor-pointer w-auto relative mb-0 text-center align-middle box-border inline-flex gap-1 items-center justify-center rounded-[12px] p-[14px_16px] bg-transparent text-[#e5d2ff] fill-[#e5d2ff] border border-[#6535be] text-sm font-medium leading-5">
    //                 See tickets
    //               </button>
    //             </div>
    //           </div>
    //           <ol className="flex flex-row items-center">
    //             <li>
    //               <button className="cursor-pointer flex justify-center items-center w-[34px] h-[34px]">
    //                 <div className="opacity-20 bg-white rounded-full transition-all duration-200 ease-in-out w-[12px] h-[12px]"></div>
    //               </button>
    //             </li>
    //             <li>
    //               <button className="cursor-pointer flex justify-center items-center w-[34px] h-[34px]">
    //                 <div className="opacity-100 bg-white rounded-full transition-all duration-200 ease-in-out w-[18px] h-[18px]"></div>
    //               </button>
    //             </li>
    //             <li>
    //               <button className="cursor-pointer flex justify-center items-center w-[34px] h-[34px]">
    //                 <div className="opacity-20 bg-white rounded-full transition-all duration-200 ease-in-out w-[12px] h-[12px]"></div>
    //               </button>
    //             </li>
    //             <li>
    //               <button className="cursor-pointer flex justify-center items-center w-[34px] h-[34px]">
    //                 <div className="opacity-20 bg-white rounded-full transition-all duration-200 ease-in-out w-[12px] h-[12px]"></div>
    //               </button>
    //             </li>
    //             <li>
    //               <button className="cursor-pointer flex justify-center items-center w-[34px] h-[34px]">
    //                 <div className="opacity-20 bg-white rounded-full transition-all duration-200 ease-in-out w-[12px] h-[12px]"></div>
    //               </button>
    //             </li>
    //           </ol>
    //         </div>

    //         {/* Image container */}
    //         <div className="relative grid-area-image rounded-t-[16px] md:rounded-r-[24px] md:rounded-l-none">
    //           <img
    //             src="https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/t_f-fs-0fv,q_auto:low,f_auto,c_fill,$w_280_mul_3,$h_180_mul_3/categories/44460/6425538"
    //             alt="Hero"
    //             className="block w-full object-cover rounded-t-[16px] h-[184px]
    //          md:rounded-r-[24px] md:rounded-l-none md:h-[260px]
    //          lg:h-[432px]"
    //           />
    //           <div className="gAZlsE"></div>
    //         </div>
    //       </a>
    //     </div>
    //   </div>
    // </section>
  );
};

export default HeroSection;
