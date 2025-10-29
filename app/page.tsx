import { ThemeProvider } from "@/contexts/theme-context"
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import EducationSection from "@/components/EducationSection"
import ProjectsSection from "@/components/ProjectsSection"
import SkillsSection from "@/components/SkillsSection"
import CertificationsSection from "@/components/CertificationsSection"
import ContactSection from "@/components/ContactSection"
import OptimizedAnimation from "@/components/optimized-animation"
import FeaturedBlogSection from "@/components/FeaturedBlogSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 md:pt-16 lg:pt-0">
          <HeroSection />

          <OptimizedAnimation>
            <section id="about">
              <AboutSection />
            </section>
          </OptimizedAnimation>

          <OptimizedAnimation delay={0.1}>
            <section id="education">
              <EducationSection />
            </section>
          </OptimizedAnimation>

          <OptimizedAnimation delay={0.1}>
            <section id="projects">
              <ProjectsSection />
            </section>
          </OptimizedAnimation>

          <OptimizedAnimation delay={0.1}>
            <section id="skills">
              <SkillsSection />
            </section>
          </OptimizedAnimation>

          <OptimizedAnimation delay={0.1}>
            <section id="certifications">
              <CertificationsSection />
            </section>
          </OptimizedAnimation>

          <OptimizedAnimation delay={0.1}>
            <section id="blog">
              <FeaturedBlogSection />
            </section>
          </OptimizedAnimation>

          <OptimizedAnimation delay={0.1}>
            <section id="contact">
              <ContactSection />
            </section>
          </OptimizedAnimation>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
