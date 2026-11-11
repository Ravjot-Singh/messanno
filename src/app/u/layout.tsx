import type { ReactNode } from "react"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

export default function PublicProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  )
}
