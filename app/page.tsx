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
