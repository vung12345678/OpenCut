"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { HeaderBase } from "./header-base";
import { useSession } from "@opencut/auth/client";
import { getStars } from "@/lib/fetch-github-stars";
import { useEffect, useState } from "react";
import Image from "next/image";

// Thêm icon cho nút
import { Paintbrush } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [star, setStar] = useState<string>("");
  // Thêm state cho background
  const [isPinkBg, setIsPinkBg] = useState(false);

  // Đọc trạng thái từ localStorage khi load
  useEffect(() => {
    const fetchStars = async () => {
      try {
        const data = await getStars();
        setStar(data);
      } catch (err) {
        console.error("Failed to fetch GitHub stars", err);
      }
    };
    fetchStars();
    // Đọc trạng thái background
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pinkBg");
      if (saved === "true") setIsPinkBg(true);
    }
  }, []);

  // Đổi biến CSS khi state đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (isPinkBg) {
        root.style.setProperty("--background", "327 100% 92%" /* #FFD1EA */);
        localStorage.setItem("pinkBg", "true");
      } else {
        root.style.setProperty("--background", "0 0% 100%" /* trắng mặc định */);
        localStorage.setItem("pinkBg", "false");
      }
    }
  }, [isPinkBg]);

  const leftContent = (
    <Link href="/" className="flex items-center gap-3">
      <Image src="/logo.svg" alt="OpenCut Logo" width={32} height={32} />
      <span className="text-xl font-medium hidden md:block">OpenCut</span>
    </Link>
  );

  // Thêm nút chuyển background vào rightContent
  const rightContent = (
    <nav className="flex items-center gap-3">
      <Button
        variant={isPinkBg ? "primary" : "outline"}
        size="sm"
        className="text-sm ml-2"
        onClick={() => setIsPinkBg((v) => !v)}
        aria-label="Đổi màu nền giao diện"
      >
        <Paintbrush className="mr-1 h-4 w-4" />
        {isPinkBg ? "Mặc định" : "Hồng pastel"}
      </Button>
      <Link href="/contributors">
        <Button variant="text" className="text-sm p-0">
          Contributors
        </Button>
      </Link>
      {process.env.NODE_ENV === "development" ? (
        <Link href="/projects">
          <Button size="sm" className="text-sm ml-4">
            Projects
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Link href="https://github.com/OpenCut-app/OpenCut" target="_blank">
          <Button size="sm" className="text-sm ml-4">
            GitHub {star}+
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </nav>
  );

  return (
    <div className="mx-4 md:mx-0">
      <HeaderBase
        className="bg-accent border rounded-2xl max-w-3xl mx-auto mt-4 pl-4 pr-[14px]"
        leftContent={leftContent}
        rightContent={rightContent}
      />
    </div>
  );
}
