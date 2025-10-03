import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle bg-[url('https://res.cloudinary.com/doxbp6clc/image/upload/v1759263367/WhatsApp_Image_2025-08-29_at_2.21.13_PM_gf9wdo.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
             className="font-oldpress text-6xl leading-10 text-ui-fg-base font-normal"
          >
            Bojo do Luar 
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Winery Store
          </Heading>
        </span>
        
      </div>
    </div>
  )
}

export default Hero
