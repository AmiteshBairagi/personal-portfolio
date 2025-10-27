import { ThemeProvider } from "@/contexts/theme-context"
import OptimizedNavbar from "@/components/optimized-navbar"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import EducationSection from "@/components/education-section"
import ProjectsSection from "@/components/projects-section"
import SkillsSection from "@/components/skills-section"
import CertificationsSection from "@/components/certifications-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import OptimizedAnimation from "@/components/optimized-animation"
import FeaturedBlogSection from "@/components/featured-blog-section"

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
       
        <OptimizedNavbar />
        <main>
          <HeroSection />

          {/* <UpdatedHero/> */}
          {/* Wrap sections in OptimizedAnimation for better performance */}
          <OptimizedAnimation tag="section" id="about">
            <AboutSection />
          </OptimizedAnimation>

          <OptimizedAnimation tag="section" id="education" delay={0.1}>
            <EducationSection />
          </OptimizedAnimation>

          <OptimizedAnimation tag="section" id="projects" delay={0.1}>
            <ProjectsSection />
          </OptimizedAnimation>

          <OptimizedAnimation tag="section" id="skills" delay={0.1}>
            <SkillsSection />
          </OptimizedAnimation>

          <OptimizedAnimation tag="section" id="certifications" delay={0.1}>
            <CertificationsSection />
          </OptimizedAnimation>

          <OptimizedAnimation tag="section" id="blog" delay={0.1}>
            <FeaturedBlogSection />
          </OptimizedAnimation>

          <OptimizedAnimation tag="section" id="contact" delay={0.1}>
            <ContactSection />
          </OptimizedAnimation>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
