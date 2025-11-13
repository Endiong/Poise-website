"use client"

import { useState, useEffect } from "react"

type DeviceSize = "mobile" | "tablet" | "desktop"

export function useResponsiveSidebar() {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    // Determine initial device size and sidebar state
    const handleResize = () => {
      const width = window.innerWidth

      if (width < 768) {
        // Mobile: < 768px
        setDeviceSize("mobile")
        setIsSidebarOpen(false)
      } else if (width < 1024) {
        // Tablet: 768px - 1024px
        setDeviceSize("tablet")
        setIsSidebarOpen(false)
      } else {
        // Desktop: >= 1024px
        setDeviceSize("desktop")
        setIsSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    // Listen for resize events
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return {
    deviceSize,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
  }
}
