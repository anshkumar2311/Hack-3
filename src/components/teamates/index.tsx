import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function Teamates() {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Abhijeet Kumar",
      designation: "Product Manager",
      src: "https://avatars.githubusercontent.com/u/187209508?v=4",
      linkedin: "https://www.linkedin.com/in/abhijeet-kr28/",
      github: "https://github.com/Abhijeet-ist",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Subham Kumar",
      designation: "InnovateSphere",
      src: "https://avatars.githubusercontent.com/u/185386201?v=4",
      linkedin: "https://www.linkedin.com/in/subham-kumar-9b6722324/",
      github: "https://github.com/SubhamKumar2511",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Ansh Kumar",
      designation: "Operations Director",
      src: "https://media.licdn.com/dms/image/v2/D5603AQHnJuqtDWlcRg/profile-displayphoto-shrink_800_800/B56ZSe10.cGsAc-/0/1737831699936?e=1745452800&v=beta&t=brJHlzb28b5Z0DCTTZaU3RoA4DPh5GCDEXfac0XWT8E",
      linkedin: "https://www.linkedin.com/in/ansh-kumar-747009311/",
      github: "https://github.com/anshkumar2311",
    },
  ];

  return <AnimatedTestimonials testimonials={testimonials} />;
}
