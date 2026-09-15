"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    need: ""
  });
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    email: false,
    need: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });
  const [isSending, setIsSending] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: null });
    }, 4000);
  };

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const needRef = useRef<HTMLSelectElement>(null);
  const doneViewRef = useRef<HTMLDivElement>(null);

  // Reveal effect on scroll
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = document.querySelectorAll(".rv");

    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => {
        el.classList.add("in");
      });
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
      );
      items.forEach((el) => {
        io.observe(el);
      });

      return () => {
        io.disconnect();
      };
    }
  }, []);

  const validateField = (field: keyof typeof formValues, value: string) => {
    const v = value.trim();
    if (!v) return false;
    if (field === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    }
    if (field === "phone") {
      return v.replace(/\D/g, "").length >= 10;
    }
    return true;
  };

  const handleBlur = (field: keyof typeof formValues) => {
    const isValid = validateField(field, formValues[field]);
    setErrors((prev) => ({ ...prev, [field]: !isValid }));
  };

  const handleChange = (field: keyof typeof formValues, val: string) => {
    setFormValues((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      const isValid = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: !isValid }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    const nameValid = validateField("name", formValues.name);
    const phoneValid = validateField("phone", formValues.phone);
    const emailValid = validateField("email", formValues.email);
    const needValid = validateField("need", formValues.need);

    const nextErrors = {
      name: !nameValid,
      phone: !phoneValid,
      email: !emailValid,
      need: !needValid
    };

    setErrors(nextErrors);

    if (!nameValid) {
      nameRef.current?.focus();
      return;
    }
    if (!phoneValid) {
      phoneRef.current?.focus();
      return;
    }
    if (!emailValid) {
      emailRef.current?.focus();
      return;
    }
    if (!needValid) {
      needRef.current?.focus();
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request.");
      }

      showToast("Consultation requested successfully!", "success");
      setSubmitted(true);

      setTimeout(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        doneViewRef.current?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "center"
        });
      }, 50);
    } catch (err: any) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* ═══ TOP BAR ═══ */}
      <div className="topbar">
        <div className="wrap topbar-in">
          <a href="tel:+919266399897">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2z" />
            </svg>
            +91 92663 99897
          </a>
          <a href="mailto:support@assistmyphd.com">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx={2} />
              <path d="m22 7-10 6L2 7" />
            </svg>
            support@assistmyphd.com
          </a>
          <span className="cred">Ethical Academic Consultancy</span>
        </div>
      </div>

      {/* ═══ HEADER ═══ */}
      <header className="hdr">
        <div className="wrap hdr-in">
          <a href="#top" className="logo">
            <img src="/logo.png" alt="Assist My PhD" className="logo-img" />
          </a>
          <div className="hdr-right">
            <a className="btn btn-call" href="tel:+919266399897" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px" }}>
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2z"/>
              </svg>
              Talk to Advisor
            </a>
            <a className="btn btn-coral" href="#contact">
              Book Free Consultation
            </a>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow on-blue">
              <span className="dot"></span>Trusted Academic Consultancy for Research Excellence
            </span>

            <h1 className="h1">
              Meaningful research begins with the <span className="hl">right guidance</span>
            </h1>

            <p className="lede on-dark">
              Assist My PhD supports PhD scholars, researchers, faculty members, and healthcare
              professionals through Academic Consulting, Academic Mentorship, and Research Advisory —
              integrating Scholarly Guidance, Research Development, Proposal Review, Publication
              Assistance, Editing &amp; Refinement, and Scholarly Coaching while promoting ethical
              research and independent learning.
            </p>

            <ul className="trust-grid">
              <li>
                <span className="ck">
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 7.4 5.4 10.8 12 3.6" />
                  </svg>
                </span>
                Ethical &amp; Confidential Guidance
              </li>
              <li>
                <span className="ck">
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 7.4 5.4 10.8 12 3.6" />
                  </svg>
                </span>
                Academic Consulting Experts
              </li>
              <li>
                <span className="ck">
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 7.4 5.4 10.8 12 3.6" />
                  </svg>
                </span>
                Structured Scholarly Guidance
              </li>
              <li>
                <span className="ck">
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 7.4 5.4 10.8 12 3.6" />
                  </svg>
                </span>
                Dedicated Research Mentor
              </li>
            </ul>

            <div className="cta-row">
              <a className="btn btn-coral" href="#contact">
                Book Your Academic Consultation
              </a>
              <a className="btn btn-out-w" href="#expertise">
                Explore Our Expertise
              </a>
            </div>
            <p className="micro on-dark">
              Free consultation<span className="sep">•</span>No obligation<span className="sep">•</span>100% Confidential
            </p>
          </div>

          {/* ── FORM on tilted slab ── */}
          <div className="form-stack" id="consult">
            <div className="form-card">
              <div id="formView" style={{ display: submitted ? "none" : "block" }}>
                <span className="form-tag">Free Consultation</span>
                <h2>Tell Us About Your Research</h2>
                <p className="fsub">Share a few details and a research advisor will get in touch with you.</p>

                <form id="leadForm" noValidate onSubmit={handleSubmit}>
                  <div className={`field ${errors.name ? "bad" : ""}`} data-f>
                    <label htmlFor="nm">
                      Full Name <span className="rq">*</span>
                    </label>
                    <input
                      ref={nameRef}
                      id="nm"
                      type="text"
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                      value={formValues.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                    />
                    <span className="err">Please enter your name</span>
                  </div>

                  <div className={`field ${errors.phone ? "bad" : ""}`} data-f>
                    <label htmlFor="ph">
                      Phone / WhatsApp <span className="rq">*</span>
                    </label>
                    <input
                      ref={phoneRef}
                      id="ph"
                      type="tel"
                      placeholder="+91"
                      autoComplete="tel"
                      required
                      value={formValues.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                    />
                    <span className="err">Enter a valid phone number</span>
                  </div>

                  <div className={`field ${errors.email ? "bad" : ""}`} data-f>
                    <label htmlFor="em">
                      Email <span className="rq">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      id="em"
                      type="email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      required
                      value={formValues.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                    />
                    <span className="err">Enter a valid email address</span>
                  </div>

                  <div className={`field ${errors.need ? "bad" : ""}`} data-f>
                    <label htmlFor="nd">
                      What do you need help with? <span className="rq">*</span>
                    </label>
                    <select
                      ref={needRef}
                      id="nd"
                      required
                      value={formValues.need}
                      onChange={(e) => handleChange("need", e.target.value)}
                      onBlur={() => handleBlur("need")}
                    >
                      <option value="">Select an option</option>
                      <option>Academic Mentorship</option>
                      <option>Thesis Consultation</option>
                      <option>Proposal Review</option>
                      <option>Research Advisory</option>
                      <option>Publication Assistance</option>
                      <option>Other</option>
                    </select>
                    <span className="err">Please select an option</span>
                  </div>

                  <button className="btn btn-coral btn-wide" type="submit" disabled={isSending}>
                    {isSending ? "Sending..." : "Get My Free Consultation"}
                  </button>
                </form>

                <p className="form-alt">
                  In a hurry? <a href="tel:+919266399897">Call +91 92663 99897</a>
                </p>
                <p className="form-foot">Your details stay confidential and are never shared.</p>
              </div>

              <div
                ref={doneViewRef}
                className={`done ${submitted ? "on" : ""}`}
                id="doneView"
                role="status"
                aria-live="polite"
              >
                <div className="ring">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12.5 9.5 18 20 6.5" />
                  </svg>
                </div>
                <h2>Request received</h2>
                <p className="fsub">A research advisor is reviewing your details now.</p>
                <ol>
                  <li>We review your requirement and match you with a subject expert.</li>
                  <li>You receive a call from our team during working hours.</li>
                  <li>The first consultation is free — nothing to pay, nothing to sign.</li>
                </ol>
                <a className="btn btn-coral btn-wide" href="tel:+919266399897">
                  Don't want to wait? Call now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT US ═══ */}
      <section className="about" id="about">
        <div className="wrap about-grid">
          <div className="rv">
            <span className="eyebrow">
              <span className="dot"></span>About Us
            </span>
            <h2 className="h2">
              Trusted Academic Consultancy for <span className="hl">Research Excellence</span>
            </h2>
            <p>
              At Assist My PhD, we believe meaningful research begins with the right guidance. Our
              platform supports PhD scholars, researchers, faculty members, and healthcare professionals
              through Academic Consulting, Academic Mentorship, and Research Advisory.
            </p>
            <p>
              Our approach integrates Scholarly Guidance, Research Development, Proposal Review,
              Publication Assistance, Editing &amp; Refinement, and Scholarly Coaching while promoting
              ethical research and independent learning.
            </p>
            <div className="pill-row">
              <span className="pill">Academic Consulting</span>
              <span className="pill">Academic Mentorship</span>
              <span className="pill">Research Advisory</span>
            </div>
          </div>

          <div className="about-card rv">
            <span className="ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <h3 style={{ color: "#fff" }}>Ethical, Guidance-First Support</h3>
            <p>
              Our role is to educate, mentor, review, and guide researchers in strengthening their
              own research capabilities — every researcher remains solely responsible for the
              originality, authenticity, analysis, conclusions, and submission of their academic work.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ OUR EXPERTISE ═══ */}
      <section className="expertise" id="expertise">
        <div className="wrap">
          <div className="sec-head mid rv">
            <span className="eyebrow">
              <span className="dot"></span>Our Expertise
            </span>
            <h2 className="h2">
              Guidance across <span className="hl">every stage of research</span>
            </h2>
            <p className="lede">Ten areas of academic support, delivered through structured, ethical mentorship.</p>
          </div>

          <div className="exp-grid rv">
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r={4} />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
                </svg>
              </span>
              <b>Academic Mentorship</b>
            </div>
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <b>Academic Consulting</b>
            </div>
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </span>
              <b>Scholarly Guidance</b>
            </div>
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </span>
              <b>Research Development</b>
            </div>
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r={10} />
                  <path d="M12 6v6l4 2" />
                </svg>
              </span>
              <b>Research Advisory</b>
            </div>
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx={2} />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <b>Proposal Review</b>
            </div>
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <path d="M14 2v6h6M9 15h6M9 11h3" />
                </svg>
              </span>
              <b>Publication Assistance</b>
            </div>
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8Z" />
                </svg>
              </span>
              <b>Editing &amp; Refinement</b>
            </div>
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                  <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
                </svg>
              </span>
              <b>Scholarly Coaching</b>
            </div>
            <div className="exp-cell">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>
              </span>
              <b>Doctoral Support Services</b>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MISSION / VISION ═══ */}
      <section className="mv" id="mission">
        <div className="wrap">
          <div className="mv-grid rv">
            <div className="mv-card m">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx={12} cy={12} r={10} />
                  <circle cx={12} cy={12} r={6} />
                  <circle cx={12} cy={12} r={2} />
                </svg>
              </span>
              <h3>Mission</h3>
              <p>
                Our mission is to provide ethical Academic Consulting, expert Academic Mentorship, and
                personalized Scholarly Guidance that help researchers develop stronger research skills,
                improve publication readiness, and confidently contribute to the global academic
                community.
              </p>
            </div>

            <div className="mv-card v">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx={12} cy={12} r={3} />
                </svg>
              </span>
              <h3>Vision</h3>
              <p>
                To become a trusted academic consultancy recognized for Research Development, Research
                Advisory, and lifelong scholarly learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MEET YOUR RESEARCH MENTOR ═══ */}
      <section className="founder" id="mentor">
        <div className="wrap f-grid">
          <div className="p-stack rv">
            <div className="portrait">
              <img
                src="/priya-phd.png"
                alt="Dr. Priyanka Gupta"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="p-badge">
              <b>Research Mentor</b>
              <span>Assist My PhD</span>
            </div>
          </div>

          <div className="rv">
            <span className="eyebrow">
              <span className="dot"></span>Meet Your Research Mentor
            </span>
            <h2 className="h2">
              Meet <span className="hl">Dr. Priyanka Gupta</span>
            </h2>
            <p className="f-quote">
              Dr. Priyanka Gupta is a dedicated academic consultant and research mentor committed to
              supporting researchers through every stage of their academic journey. With extensive
              experience in research methodology, publication guidance, academic consulting, and
              scholarly mentoring, she has helped researchers strengthen their understanding of
              research and improve their academic confidence.
            </p>
            <p className="f-name">Dr. Priyanka Gupta</p>
            <p className="f-role">Academic Consultant &amp; Research Mentor</p>
            <div className="cta-row" style={{ marginTop: "28px" }}>
              <a className="btn btn-indigo" href="#contact">
                Book Your Academic Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DR. PRIYANKA'S PUBLICATIONS ═══ */}
      <section className="pubs">
        <div className="wrap">
          <div className="pubs-head rv">
            <h3>Dr. Priyanka's Publications</h3>
            <p>A selection of published research papers and academic work.</p>
          </div>

          <div className="pubs-grid rv">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <a
                key={num}
                href={`/publications/pub${num}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="pub-frame"
                style={{ overflow: "hidden", borderStyle: "solid" }}
              >
                <img
                  src={`/publications/pub${num}.png`}
                  alt={`Publication ${num}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OUR VALUES ═══ */}
      <section className="values" id="values">
        <div className="wrap">
          <div className="sec-head mid rv">
            <span className="eyebrow">
              <span className="dot"></span>Our Values
            </span>
            <h2 className="h2">
              Principles that guide <span className="hl">every consultation</span>
            </h2>
          </div>

          <div className="val-grid rv">
            <article className="val-card accent">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </span>
              <h3 className="h3">Academic Excellence</h3>
              <p>
                We are committed to maintaining the highest standards of academic quality through evidence-based
                consultation and continuous learning.
              </p>
            </article>

            <article className="val-card">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <h3 className="h3">Academic Integrity</h3>
              <p>We encourage originality, ethical research practices, and responsible scholarship in every consultation.</p>
            </article>

            <article className="val-card">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </span>
              <h3 className="h3">Research Excellence</h3>
              <p>We believe strong research is built through structured guidance, critical thinking, and continuous improvement.</p>
            </article>

            <article className="val-card">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r={4} />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
                </svg>
              </span>
              <h3 className="h3">Collaboration</h3>
              <p>We work alongside researchers as mentors and advisors, encouraging independent learning rather than dependency.</p>
            </article>

            <article className="val-card">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx={2} />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <h3 className="h3">Confidentiality</h3>
              <p>Every consultation, discussion, and research interaction is handled with complete professionalism and confidentiality.</p>
            </article>

            <article className="val-card">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r={10} />
                  <path d="M12 6v6l4 2" />
                </svg>
              </span>
              <h3 className="h3">Lifelong Learning</h3>
              <p>
                We inspire researchers to continuously develop their academic capabilities through mentorship, coaching, and
                scholarly development.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ═══ ACADEMIC INTEGRITY BAND ═══ */}
      <section className="integrity">
        <div className="wrap integrity-in rv">
          <span className="eyebrow on-blue">
            <span className="dot"></span>Academic Integrity
          </span>
          <h2 className="h2">
            Educate, mentor, guide — <span className="hl">you remain the author</span>
          </h2>
          
          <div className="integrity-grid">
            <div className="integrity-card">
              <span className="integrity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                  <path d="M6 6h10M6 10h10"/>
                </svg>
              </span>
              <h3>Consultation Scope</h3>
              <p>
                Academic Consulting, Academic Mentorship, Research Advisory, Research Development, Proposal Review, Publication Assistance, Editing &amp; Refinement, and Scholarly Coaching exclusively for educational and professional development.
              </p>
            </div>
            <div className="integrity-card">
              <span className="integrity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </span>
              <h3>Scholar Ownership</h3>
              <p>
                Our role is to educate, mentor, review, and guide researchers in strengthening their own research capabilities. Every researcher remains solely responsible for the originality, authenticity, analysis, conclusions, and submission of their academic work.
              </p>
            </div>
            <div className="integrity-card">
              <span className="integrity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </span>
              <h3>Ethical Standard</h3>
              <p>
                Our commitment is to promote ethical research practices, responsible scholarship, and independent academic growth, fostering a culture of scholarly integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="tests">
        <div className="wrap">
          <div className="sec-head mid rv">
            <span className="eyebrow">
              <span className="dot"></span>Testimonials
            </span>
            <h2 className="h2">
              From researchers <span className="hl">we have mentored</span>
            </h2>
          </div>

          <div className="t-grid rv">
            <article className="t-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span className="qm" style={{ marginBottom: 0 }}>&ldquo;</span>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="#F59E0B" style={{ width: "16px", height: "16px" }}>
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p style={{ marginBottom: "20px", fontStyle: "italic" }}>
                &ldquo;They really guided me and assisted in making the right choices. Highly recommended for anyone who is considering doing a PhD to contact them. They are highly professional and not at all money-minded like others.&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--indigo-50)", color: "var(--indigo-700)", display: "grid", placeItems: "center", fontSize: "0.85rem", fontWeight: "700", flexShrink: 0 }}>
                  AA
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.94rem", fontWeight: "700", color: "var(--indigo-900)" }}>Arpit Anand</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "12px", height: "12px", color: "#10B981" }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg> Verified Google Reviewer
                  </span>
                </div>
              </div>
            </article>

            <article className="t-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span className="qm" style={{ marginBottom: 0 }}>&ldquo;</span>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="#F59E0B" style={{ width: "16px", height: "16px" }}>
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p style={{ marginBottom: "20px", fontStyle: "italic" }}>
                &ldquo;Amazing service and top notch communication. Even outside city their services are too good and too much decent behaviour.&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--indigo-50)", color: "var(--indigo-700)", display: "grid", placeItems: "center", fontSize: "0.85rem", fontWeight: "700", flexShrink: 0 }}>
                  KB
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.94rem", fontWeight: "700", color: "var(--indigo-900)" }}>Koushiki Bhattacharjee</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "12px", height: "12px", color: "#10B981" }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg> Verified Google Reviewer
                  </span>
                </div>
              </div>
            </article>

            <article className="t-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span className="qm" style={{ marginBottom: 0 }}>&ldquo;</span>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="#F59E0B" style={{ width: "16px", height: "16px" }}>
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p style={{ marginBottom: "20px", fontStyle: "italic" }}>
                &ldquo;Very helpful and responsive. And quality service value for money. Highly recommend their professional consulting team.&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--indigo-50)", color: "var(--indigo-700)", display: "grid", placeItems: "center", fontSize: "0.85rem", fontWeight: "700", flexShrink: 0 }}>
                  MS
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.94rem", fontWeight: "700", color: "var(--indigo-900)" }}>Mudit Singh</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "12px", height: "12px", color: "#10B981" }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg> Verified Google Reviewer
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT / FINAL CTA ═══ */}
      <section className="final" id="contact">
        <div className="wrap final-in rv">
          <span className="eyebrow on-blue">
            <span className="dot"></span>Contact
          </span>
          <h2 className="h2">
            Let's Discuss <span className="hl">Your Research Journey</span>
          </h2>
          <p className="lede on-dark" style={{ marginInline: "auto" }}>
            Whether you're beginning your doctoral journey or preparing your work for publication,
            we're here to support you through ethical consultation and personalized mentorship.
          </p>
          <div className="cta-row mid">
            <a className="btn btn-coral" href="#consult">
              Book Your Academic Consultation
            </a>
            <a className="btn btn-out-w" href="tel:+919266399897">
              Or call +91 92663 99897
            </a>
          </div>
          <p className="micro on-dark">
            Free consultation<span className="sep">•</span>No obligation<span className="sep">•</span>100% Confidential
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="ftr">
        <div className="wrap">
          <div className="ftr-top">
            <div>
              <span className="logo" style={{ display: "block", marginBottom: "16px" }}>
                <img src="/logo.png" alt="Assist My PhD" style={{ height: "48px", width: "auto" }} />
              </span>
              <p>Ethical academic mentorship and research guidance for PhD and MS scholars.</p>
              <p className="disclaimer">
                Assist My PhD provides academic mentorship, consultation and research guidance.
                All research work, ideas and final submissions remain the responsibility and
                ownership of the scholar.
              </p>
            </div>

            <div>
              <h4>Quick Links</h4>
              <p>
                <a href="#contact">Book a Consultation</a>
              </p>
              <p>
                <a href="#mentor">About the Founder</a>
              </p>
              <p>
                <a href="tel:+919266399897">Call an Advisor</a>
              </p>
              <p>
                <a href="https://wa.me/919266399899?text=Hello!%20I%20would%20like%20to%20inquire%20about%20PhD%20academic%20consultation%20and%20mentorship%20services." target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </p>
            </div>

            <div>
              <h4>Contact</h4>
              <div className="ftr-row">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r={3} />
                </svg>
                <p style={{ margin: 0 }}>
                  601, A Block, Prashant Sagar Society,
                  <br />
                  Kanadia Road, Bangali Square,
                  <br />
                  Indore (M.P.) 452016
                </p>
              </div>
              <div className="ftr-row">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2z" />
                </svg>
                <p style={{ margin: 0 }}>
                  <a href="tel:+919266399897">+91 92663 99897</a>
                </p>
              </div>
              <div className="ftr-row">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx={2} />
                  <path d="m22 7-10 6L2 7" />
                </svg>
                <p style={{ margin: 0 }}>
                  <a href="mailto:support@assistmyphd.com">support@assistmyphd.com</a>
                </p>
              </div>
            </div>
          </div>

          <div className="ftr-bar">
            <span>&copy; 2026 Assist My PhD. All rights reserved.</span>
            <span>Landing page by CoolCliQ</span>
          </div>
        </div>
      </footer>

      {/* ═══ MOBILE BAR ═══ */}
      <nav className="mbar" aria-label="Quick contact">
        <a className="pri" href="tel:+919266399897">
          Talk to Advisor
        </a>
        <a href="https://wa.me/919266399899?text=Hello!%20I%20would%20like%20to%20inquire%20about%20PhD%20academic%20consultation%20and%20mentorship%20services." target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <a href="#consult">Consult</a>
      </nav>

      {/* ═══ FLOATING WHATSAPP BUTTON ═══ */}
      <a
        href="https://wa.me/919266399899?text=Hello!%20I%20would%20like%20to%20inquire%20about%20PhD%20academic%20consultation%20and%20mentorship%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        title="Chat with us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>Talk with us</span>
      </a>

      {/* ═══ TOAST NOTIFICATION ═══ */}
      {toast.type && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            background: toast.type === "success" ? "#10B981" : "#EF4444",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "50px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "700",
            fontSize: "0.95rem",
            animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {toast.type === "success" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </>
  );
}
