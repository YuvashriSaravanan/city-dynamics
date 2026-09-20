/* ===== City Dynamics - JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
    // ── Preloader ──
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('hidden'), 600);
        });
        // Fallback if load event already fired
        if (document.readyState === 'complete') {
            setTimeout(() => preloader.classList.add('hidden'), 600);
        }
    }

    // ── Navbar scroll behaviour ──
    const navbar = document.querySelector('.navbar');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar shrink
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll-to-top button
        if (scrollToTopBtn) {
            if (scrollY > 400) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        // Active nav link based on scroll position
        updateActiveNav();
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial call

    // ── Scroll-to-top click ──
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── Active nav link ──
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
        let currentId = '';

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    }

    // ── Smooth scroll for nav links & close mobile menu ──


    const navCollapse = document.getElementById('navbarNav');
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });

                // Close mobile nav
                if (navCollapse && navCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    // ── Scroll-triggered animations (Intersection Observer) ──
    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
    );

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Stagger children if they have data-delay
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        animatedElements.forEach((el) => observer.observe(el));
    } else {
        // Fallback: show all immediately
        animatedElements.forEach((el) => el.classList.add('visible'));
    }

    // ── Counter animation ──
    const counters = document.querySelectorAll('[data-count]');

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = prefix + current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = prefix + target.toLocaleString() + suffix;
                el.classList.add('counted');
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach((counter) => animateCounter(counter));
    }

    // ── Hero chart bar animation ──
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar) => {
        const height = bar.dataset.height;
        if (height) {
            setTimeout(() => {
                bar.style.height = height;
            }, 800);
        }
    });

    // ── Dashboard preview bar animation ──
    const dpBars = document.querySelectorAll('.dp-bar');
    if ('IntersectionObserver' in window) {
        const barObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bars = entry.target.querySelectorAll('.dp-bar');
                        bars.forEach((bar) => {
                            const h = bar.dataset.height;
                            if (h) {
                                setTimeout(() => {
                                    bar.style.height = h;
                                }, 300);
                            }
                        });
                        barObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        const chartArea = document.querySelector('.dp-chart-area');
        if (chartArea) barObserver.observe(chartArea);
    }

    // ── Typed effect for hero tag ──
    const heroTag = document.querySelector('.hero-tag-text');
    if (heroTag) {
        const text = heroTag.dataset.text || heroTag.textContent;
        heroTag.textContent = '';
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                heroTag.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 50);
            }
        }
        setTimeout(typeChar, 1200);
    }

    // ── Contact form handler ──
    const contactForm = document.getElementById("contactForm");

    // ── Success Modal ──
    const successModal = document.getElementById("successModal");
    const successModalMsg = document.getElementById("successModalMessage");
    const successModalClose = document.getElementById("successModalClose");

    if (successModalClose) {
        successModalClose.addEventListener("click", () => {
            successModal.style.display = "none";
        });
    }

    // Close modal when clicking the backdrop
    if (successModal) {
        successModal.addEventListener("click", (e) => {
            if (e.target === successModal) {
                successModal.style.display = "none";
            }
        });
    }

    // ── Error Toast ──
    const errorToast = document.getElementById("errorToast");
    const errorToastMsg = document.getElementById("errorToastMessage");
    const errorToastClose = document.getElementById("errorToastClose");
    let errorToastTimer = null;

    if (errorToastClose) {
        errorToastClose.addEventListener("click", () => {
            errorToast.style.display = "none";
            clearTimeout(errorToastTimer);
        });
    }

    function showErrorToast(message) {
        errorToastMsg.textContent = message;
        errorToast.style.display = "flex";
        clearTimeout(errorToastTimer);
        errorToastTimer = setTimeout(() => {
            errorToast.style.display = "none";
        }, 7000);
    }

    // ── Validation helpers ──
    function clearFieldError(input) {
        input.classList.remove("is-invalid");
        const existingErr = input.parentElement.querySelector(".form-validation-error");
        if (existingErr) existingErr.remove();
    }

    function showFieldError(input, message) {
        input.classList.add("is-invalid");
        let errEl = input.parentElement.querySelector(".form-validation-error");
        if (!errEl) {
            errEl = document.createElement("span");
            errEl.className = "form-validation-error";
            input.parentElement.appendChild(errEl);
        }
        errEl.textContent = message;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (contactForm) {

        const nameInput = document.getElementById("contactName");
        const emailInput = document.getElementById("contactEmail");
        const submitBtn = contactForm.querySelector("button[type='submit']");

        // Clear errors on input
        [nameInput, emailInput].forEach(input => {
            input.addEventListener("input", () => clearFieldError(input));
        });

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // ── Validate name ──
            let valid = true;
            const nameVal = nameInput.value.trim();
            const emailVal = emailInput.value.trim();

            clearFieldError(nameInput);
            clearFieldError(emailInput);

            // Remove any existing chart error
            const existingChartErr = contactForm.querySelector(".chart-selection-error");
            if (existingChartErr) existingChartErr.remove();

            if (!nameVal) {
                showFieldError(nameInput, "Please enter your name.");
                valid = false;
            }

            if (!emailVal) {
                showFieldError(emailInput, "Please enter your email address.");
                valid = false;
            } else if (!isValidEmail(emailVal)) {
                showFieldError(emailInput, "Please enter a valid email address.");
                valid = false;
            }

            // ── Validate chart selection ──
            const selectedCharts = [];
            document.querySelectorAll('input[name="charts"]:checked')
                .forEach(cb => selectedCharts.push(cb.value));

            if (selectedCharts.length === 0) {
                const chartErrEl = document.createElement("p");
                chartErrEl.className = "chart-selection-error";
                chartErrEl.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Please select at least one dashboard chart.';
                // Insert after the last chart-selection-group
                const chartGroups = contactForm.querySelectorAll(".chart-selection-group");
                const lastGroup = chartGroups[chartGroups.length - 1];
                if (lastGroup) lastGroup.after(chartErrEl);
                valid = false;
            }

            if (!valid) return;

            // ── Loading state ──
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-spinner"></span>Sending Request...';

            const templateParams = {
                name: nameVal,
                email: emailVal,
                charts: selectedCharts.join(", "),
                message: document.getElementById("contactMessage").value,
                // Explicit recipient field for user confirmation template
                to_email: emailVal,
                to_name: nameVal
            };

            // Send admin notification first, then user confirmation
            emailjs.send("service_x36a5nb", "template_cgqgva7", templateParams)
                .then(() => {
                    // Admin email sent — now send user confirmation
                    return emailjs.send("service_x36a5nb", "template_u8zt06j", templateParams);
                })
                .then(() => {
                    // ── Success ──
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;

                    successModalMsg.textContent =
                        `Thank you, ${nameVal}. Your dashboard report request has been received successfully. A confirmation email has been sent to ${emailVal}.`;
                    successModal.style.display = "flex";

                    contactForm.reset();
                })
                .catch((err) => {
                    // ── Error ──
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                    console.error("EmailJS error:", err);
                    showErrorToast("Something went wrong while sending your request. Please try again.");
                });

        });

    }
    // ── Dark Mode Toggle ──
    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                themeToggle.innerHTML = "☀️";
            } else {
                themeToggle.innerHTML = "🌙";
            }
        });
    }
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    const iframe = document.getElementById("powerbiIframe");

    if (fullscreenBtn && iframe) {
        fullscreenBtn.addEventListener("click", () => {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
            }
        });
    }

    // ── Open Dashboard Button (FIXED: opens Power BI in new tab) ──
    const openDashboardBtn = document.getElementById("openDashboardBtn");

    if (openDashboardBtn) {
        openDashboardBtn.addEventListener("click", () => {
            const powerbiUrl = "https://app.powerbi.com/view?r=eyJrIjoiNWYyNTRjOWQtOWE4Ni00ZjU5LTlmZjYtMTI2YTlhOGZmNmU3IiwidCI6IjhmYWQ5NzYxLWZhZGItNDFiNi04YTFkLWRjMDVkNWRjNGY5YiJ9";
            window.open(powerbiUrl, "_blank");
        });
    }

    // ══════════════════════════════════════════════════════════
    // ══  SMART AI CHATBOT — Dashboard Knowledge Base  ══
    // ══════════════════════════════════════════════════════════

    const chatToggle = document.getElementById("chatToggle");
    const chatWindow = document.getElementById("chatWindow");
    const closeChat = document.getElementById("closeChat");
    const chatMessages = document.getElementById("chatMessages");
    const userMessageInput = document.getElementById("userMessage");
    const sendMessageBtn = document.getElementById("sendMessage");

    // Toggle chat window
    if (chatToggle) {
        chatToggle.addEventListener("click", () => {
            chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
        });
    }

    if (closeChat) {
        closeChat.addEventListener("click", () => {
            chatWindow.style.display = "none";
        });
    }

    // Send on button click
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener("click", () => {
            handleUserMessage();
        });
    }

    // Send on Enter key
    if (userMessageInput) {
        userMessageInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleUserMessage();
            }
        });
    }

    function handleUserMessage() {
        const msg = userMessageInput.value.trim();
        if (!msg) return;

        // Add user message
        appendMessage(msg, "user");
        userMessageInput.value = "";

        // Show typing indicator then respond
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const reply = getBotResponse(msg);
            appendMessage(reply, "bot");
        }, 600 + Math.random() * 400);
    }

    function appendMessage(text, sender) {
        const div = document.createElement("div");
        div.className = sender === "user" ? "user-message" : "bot-message";
        div.innerHTML = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const div = document.createElement("div");
        div.className = "bot-message typing-indicator";
        div.id = "typingIndicator";
        div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const el = document.getElementById("typingIndicator");
        if (el) el.remove();
    }

    // ── Dashboard Knowledge Base ──
    const knowledgeBase = [
        // GDP
        {
            keywords: ["what is gdp", "gdp meaning", "define gdp", "gdp definition", "gross domestic product"],
            response: "📊 <strong>GDP (Gross Domestic Product)</strong> is the total monetary value of all goods and services produced within a city or country over a specific period. In our dashboard, we track GDP across <strong>18 Indian cities</strong> from <strong>2019 to 2026</strong>, helping identify which cities drive the most economic output and how GDP trends change over time."
        },
        // Dashboard Overview
        {
            keywords: ["explain dashboard", "about dashboard", "dashboard overview", "what is dashboard", "describe dashboard"],
            response: "📋 <strong>The Dashboard</strong> has <strong>3 pages</strong>:<br><br>📄 <strong>Page 1 — KPI & Overview:</strong> Shows KPI Cards (Total Cities, Population, GDP, GDP Per Capita, Unemployment), Top 10 Cities by GDP, Employment & Unemployment Analysis, and Population vs GDP Scatter Plot. Slicers: Year, Covid Period, Tier.<br><br>📄 <strong>Page 2 — Sector & Income:</strong> Donut Chart (Avg Per Capita by State), Treemap (Sector Contribution for 18 cities), Tourism Contribution (Line + Clustered Column), Income Inequality (Clustered Bar). Slicers: Year, Sector.<br><br>📄 <strong>Page 3 — Policy & Regime:</strong> Cards for Pre-Independence GDP, Post-Independence GDP, Post-LPG GDP, Key Beneficiary States chart, and GDP Across Ruling Regimes matrix."
        },
        // KPI Cards
        {
            keywords: ["explain kpi", "kpi cards", "what are kpi", "kpi overview", "key performance"],
            response: "📌 <strong>KPI Cards</strong> on Page 1 display five key metrics at a glance:<br><br>🏙️ <strong>Total Cities:</strong> Number of cities analyzed (18)<br>👥 <strong>Total Population:</strong> Combined population across all cities<br>💰 <strong>Total GDP:</strong> Aggregate GDP of all 18 cities<br>📈 <strong>GDP Per Capita:</strong> Average economic output per person<br>📉 <strong>Total Unemployment:</strong> Aggregate unemployment figures<br><br>These cards change dynamically based on the Year, Covid Period, and Tier slicers you select."
        },
        // Top 10 Cities by GDP
        {
            keywords: ["top 10", "top cities", "highest gdp", "top gdp cities", "cities by gdp", "gdp ranking"],
            response: "🏆 <strong>Top 10 Cities by GDP</strong> is a bar chart on Page 1 that ranks the highest GDP-producing cities. Metro cities like Mumbai, Delhi, and Bangalore consistently dominate. The chart is filterable by Year, Covid Period, and Tier — so you can see how rankings shifted during COVID or compare Tier 1 vs Tier 2 city performance."
        },
        // Population vs GDP Scatter
        {
            keywords: ["scatter", "population vs gdp", "scatter plot", "population gdp", "bubble chart"],
            response: "🔵 <strong>Population vs GDP Scatter Plot</strong> compares Population (X-axis) against GDP (Y-axis) for all 18 cities. Bigger bubbles indicate higher <strong>GDP per Capita</strong>. Different colours represent <strong>Tier 1 and Tier 2</strong> cities. A key insight is that higher population doesn't always mean higher GDP — several smaller cities achieve better GDP per capita, showing superior productivity and resource utilization."
        },
        // Employment & Unemployment
        {
            keywords: ["employment", "unemployment", "employment chart", "job", "employment analysis", "employment vs unemployment"],
            response: "👷 <strong>Employment & Unemployment Analysis</strong> on Page 1 visualizes the workforce data across 18 cities. It shows an inverse relationship — cities with diversified economies across IT, Manufacturing, and Tourism exhibit <strong>lower unemployment</strong> rates. Cities overly dependent on a single sector tend to have higher unemployment. Use Year, Covid Period, and Tier slicers to see how COVID-19 impacted employment across different city tiers."
        },
        // Population
        {
            keywords: ["population", "total population", "people", "population data"],
            response: "👥 <strong>Population</strong> data covers all 18 cities from 2019 to 2026. The KPI card shows Total Population across all cities. In the Scatter Plot, population is plotted against GDP to reveal that larger cities don't always translate to higher economic output per person. Population density and urbanization patterns vary significantly across Tier 1 and Tier 2 cities."
        },
        // Per Capita
        {
            keywords: ["per capita", "gdp per capita", "income per person", "per capita income", "average per capita", "donut"],
            response: "💵 <strong>GDP Per Capita</strong> measures the average economic output per person. The KPI card on Page 1 shows the overall figure, while the <strong>Donut Chart</strong> on Page 2 breaks down <strong>Average Per Capita by State</strong>, revealing which states provide the highest per-person income. States with strong IT and service sectors typically show higher per capita figures."
        },
        // Tourism Contribution
        {
            keywords: ["tourism", "tourism contribution", "tourist", "hotel", "transport", "travel", "tourism chart"],
            response: "✈️ <strong>Tourism Contribution</strong> chart (Page 2) is a Line + Clustered Column chart that compares:<br><br>🏨 <strong>Hotel Contribution</strong><br>🚌 <strong>Transport Contribution</strong><br>💰 <strong>Tourism GDP</strong><br>📊 <strong>Annual Tourist Visits</strong><br><br>It shows tourism GDP alongside hotel and transport contributions for each city. Coastal and heritage cities benefit the most. Use the Year and Sector slicers to filter the data."
        },
        // Manufacturing
        {
            keywords: ["manufacturing", "industry", "factory", "manufacturing sector", "industrial"],
            response: "🏭 <strong>Manufacturing</strong> is one of the 4 key sectors analyzed. It contributes significantly to GDP in industrial hubs. The Treemap on Page 2 shows sector-wise contributions where Manufacturing is a dominant force in cities like Chennai, Pune, and Ahmedabad. Use the Sector slicer to isolate Manufacturing data and compare across all 18 cities."
        },
        // IT Sector
        {
            keywords: ["it sector", "information technology", "it industry", "software", "tech sector", "it contribution"],
            response: "💻 <strong>IT (Information Technology)</strong> is a major economic driver, especially in Tier 1 cities like Bangalore, Hyderabad, and Pune. The Treemap chart on Page 2 shows IT's sector contribution across all 18 cities. IT-heavy cities tend to show higher GDP per capita and lower unemployment rates. Use the Sector slicer set to 'IT' to see its specific impact."
        },
        // Agriculture
        {
            keywords: ["agriculture", "farming", "agri", "agricultural", "crop", "rural"],
            response: "🌾 <strong>Agriculture</strong> is one of the 4 analyzed sectors. While its GDP contribution is typically lower compared to IT and Manufacturing in urban areas, it plays a critical role in Tier 2 cities and surrounding regions. The Treemap on Page 2 lets you filter by Agriculture to see which cities have notable agricultural sector contributions."
        },
        // Treemap / Sector Contribution
        {
            keywords: ["treemap", "sector contribution", "sector analysis", "sector breakdown", "sectors"],
            response: "🗂️ <strong>Sector Contribution Treemap</strong> (Page 2) displays how each of the <strong>4 sectors — IT, Manufacturing, Tourism, and Agriculture</strong> — contributes to GDP across all <strong>18 cities</strong>. The size of each block represents the sector's contribution. Use the <strong>Sector slicer</strong> to focus on a specific sector and see which cities lead in that domain."
        },
        // Income Inequality
        {
            keywords: ["income inequality", "inequality", "gini", "income gap", "income disparity", "clustered bar"],
            response: "📊 <strong>Income Inequality</strong> (Page 2) uses a <strong>Clustered Bar Chart</strong> to compare income distribution across cities. Cities with heavy reliance on a single sector tend to have <strong>wider income gaps</strong> between high and low earners. Diversified economies show more balanced income distribution. This chart helps identify which cities need targeted policy interventions to reduce inequality."
        },
        // Policy Analysis
        {
            keywords: ["policy", "policy analysis", "pre independence", "post independence", "post lpg", "lpg", "liberalization", "1991", "beneficiary states", "key beneficiary"],
            response: "📜 <strong>Policy & Regime Analysis</strong> (Page 3) examines GDP across three major policy eras:<br><br>🏛️ <strong>Pre-Independence GDP:</strong> Economic output before 1947<br>🇮🇳 <strong>Post-Independence GDP:</strong> Growth after 1947 with planned economy policies<br>📈 <strong>Post-LPG GDP:</strong> Dramatic acceleration after the 1991 Liberalization, Privatization & Globalization reforms<br><br>The <strong>Key Beneficiary States</strong> chart shows which states benefited most from these policy shifts. Policy milestones tracked: 1900, 1910, 1920, 1930, 1940, 1947, 1950, 1960, 1970, 1980, 1991, 2000, 2004, 2010, 2014, 2017, 2020, 2024, 2026."
        },
        // GDP Across Regimes
        {
            keywords: ["regime", "ruling regime", "gdp across regimes", "political", "government", "matrix", "regime analysis"],
            response: "🏛️ <strong>GDP Across Ruling Regimes</strong> (Page 3) is a <strong>Matrix visual</strong> that shows how GDP varied under different ruling regimes and political periods. It reveals varying growth trajectories tied to key policy decisions made by different governments. This analysis helps understand the economic impact of governance styles and policy priorities across different political eras."
        },
        // Tier 1 vs Tier 2
        {
            keywords: ["tier 1", "tier 2", "tier comparison", "city tier", "metro", "non metro"],
            response: "🏙️ <strong>Tier 1 vs Tier 2 Cities:</strong> The dashboard uses a <strong>Tier slicer</strong> on Page 1 to compare performance. <strong>Tier 1</strong> cities (Mumbai, Delhi, Bangalore, etc.) dominate in GDP and IT sector contribution but also show higher costs and income inequality. <strong>Tier 2</strong> cities often show better GDP per capita growth rates and emerging sector strength. The Scatter Plot uses different colours for each tier to visually distinguish their performance."
        },
        // COVID Impact
        {
            keywords: ["covid", "pandemic", "covid period", "corona", "lockdown", "covid impact"],
            response: "🦠 <strong>COVID Period Analysis:</strong> Page 1 includes a <strong>Covid Period slicer</strong> that filters data to show the pandemic's impact. During COVID, most cities saw GDP decline, unemployment spikes, and tourism sector collapse. Tier 1 cities with strong IT sectors recovered faster due to remote work capabilities. The Employment chart clearly shows the employment dip during 2020-2021."
        },
        // Future Scope
        {
            keywords: ["future scope", "future", "what's next", "upcoming", "future plans", "roadmap"],
            response: "🚀 <strong>Future Scope</strong> includes exciting planned enhancements:<br><br>🤖 <strong>AI-Powered Predictions:</strong> ML models to forecast GDP growth for next 5-10 years<br>⏱️ <strong>Real-Time Data Feeds:</strong> Live economic indicator APIs<br>📱 <strong>Mobile Application:</strong> Dedicated app with push notifications<br>🗺️ <strong>Expanded City Coverage:</strong> Scale beyond 18 cities to all state capitals<br>🔗 <strong>Blockchain Verification:</strong> Data provenance and authenticity<br>💬 <strong>Natural Language Queries:</strong> Ask questions in plain English and get visual answers"
        },
        // About Project
        {
            keywords: ["about project", "about this project", "project details", "project info", "what is this project", "about"],
            response: "📋 <strong>City Dynamics: GDP & Productivity Insights</strong> is a <strong>Final Year Engineering Project</strong> that analyzes urban economic performance across <strong>18 major Indian cities</strong> from <strong>2019 to 2026</strong>. It uses interactive <strong>Power BI dashboards</strong> with <strong>3 report pages</strong> covering KPIs, Sector Analysis, and Policy Impact. The project tracks <strong>4 key sectors</strong> (IT, Manufacturing, Tourism, Agriculture) and <strong>19 policy milestones</strong> from 1900 to 2026. Built with HTML, CSS, JavaScript, Bootstrap 5, and Power BI."
        },
        // Contact Team
        {
            keywords: ["contact", "team", "contact team", "email", "reach out", "get in touch"],
            response: "📧 <strong>Contact the Team:</strong><br><br>📩 Email: <strong>harinikalimuthu14@gmail.com</strong><br>⏰ Response Time: Reports delivered within <strong>24 hours</strong><br>📊 Available: <strong>9 dashboard charts</strong> across 3 report pages<br><br>You can also use the <strong>Request Dashboard Report</strong> section on the website to select specific charts and receive detailed reports with explanations."
        },
        // Productivity
        {
            keywords: ["productivity", "output", "efficiency", "workforce efficiency"],
            response: "⚡ <strong>Productivity</strong> measures how efficiently a city converts inputs (labor, capital) into economic output. In our dashboard, productivity is reflected through <strong>GDP per Capita</strong> — higher GDP per capita means better productivity. Cities with diversified economies and strong IT/Manufacturing sectors tend to show higher productivity. The Scatter Plot on Page 1 helps visualize which cities are most productive relative to their population."
        },
        // Power BI
        {
            keywords: ["power bi", "powerbi", "tool", "visualization tool"],
            response: "📊 <strong>Power BI</strong> is Microsoft's business intelligence tool used to build our interactive dashboard. It enables dynamic filtering through <strong>Slicers</strong> (Year, Sector, Tier, Covid Period), interactive charts, drill-down capabilities, and cross-filtering. The dashboard has <strong>3 pages</strong> with KPI cards, bar charts, scatter plots, donut charts, treemaps, line charts, clustered bars, and matrix visuals."
        },
        // Year / Data Range
        {
            keywords: ["year", "data range", "time period", "2019", "2026", "years covered"],
            response: "📅 The dashboard covers city data from <strong>2019 to 2026</strong>. Use the <strong>Year slicer</strong> on Pages 1 and 2 to filter all charts and KPIs for a specific year. This allows you to track how GDP, employment, sector contributions, and other metrics evolved year over year across all 18 cities."
        },
        // General greetings
        {
            keywords: ["hi", "hello", "hey", "good morning", "good evening", "greetings"],
            response: "👋 Hello! I'm your <strong>City Dynamics Dashboard Assistant</strong>. I can explain any chart, metric, or concept from the dashboard. Try asking about:<br><br>• GDP, Population, Per Capita<br>• Employment & Unemployment<br>• Sector Analysis (IT, Manufacturing, Tourism, Agriculture)<br>• Policy & Regime Analysis<br>• Income Inequality<br>• Any specific chart!"
        },
        // Thanks
        {
            keywords: ["thanks", "thank you", "thx", "appreciate"],
            response: "😊 You're welcome! Feel free to ask me anything else about the dashboard. I'm here to help you explore City Dynamics data!"
        },
        // Help
        {
            keywords: ["help", "what can you do", "features", "capabilities"],
            response: "🤖 I can help you understand:<br><br>📊 <strong>Charts:</strong> Top 10 GDP, Scatter Plot, Treemap, Tourism, Income Inequality, Employment, Policy, Regimes<br>📌 <strong>KPIs:</strong> Total Cities, Population, GDP, Per Capita, Unemployment<br>🏭 <strong>Sectors:</strong> IT, Manufacturing, Tourism, Agriculture<br>📜 <strong>Analysis:</strong> Policy Impact, Pre/Post Independence, Post-LPG, Tier Comparison, COVID Impact<br><br>Just type your question or use the <strong>Quick Questions</strong> buttons!"
        }
    ];

    function getBotResponse(userMsg) {
        const input = userMsg.toLowerCase().trim();

        // Search through knowledge base
        for (const entry of knowledgeBase) {
            for (const keyword of entry.keywords) {
                if (input.includes(keyword)) {
                    return entry.response;
                }
            }
        }

        // Partial matching fallback - check for individual important words
        const importantTerms = {
            "gdp": 0,
            "dashboard": 1,
            "kpi": 2,
            "scatter": 4,
            "employment": 5,
            "unemployment": 5,
            "population": 6,
            "capita": 7,
            "tourism": 8,
            "manufacturing": 9,
            "it": 10,
            "agriculture": 11,
            "treemap": 12,
            "inequality": 13,
            "policy": 14,
            "regime": 15,
            "tier": 16,
            "covid": 17,
            "future": 18,
            "project": 19,
            "contact": 20,
            "productivity": 21,
            "power bi": 22,
            "year": 23
        };

        const words = input.split(/\s+/);
        for (const word of words) {
            if (importantTerms.hasOwnProperty(word)) {
                return knowledgeBase[importantTerms[word]].response;
            }
        }

        // Default fallback
        return "🤔 I'm not sure about that specific question. Try asking about:<br><br>• <strong>GDP</strong> — What is GDP? Top 10 cities<br>• <strong>Charts</strong> — Scatter Plot, Treemap, Tourism, Employment<br>• <strong>Sectors</strong> — IT, Manufacturing, Tourism, Agriculture<br>• <strong>Policy</strong> — Pre/Post Independence, LPG, Regimes<br>• <strong>KPIs</strong> — Population, Per Capita, Unemployment<br><br>Or use the <strong>Quick Questions</strong> buttons below for instant answers!";
    }

}); // end DOMContentLoaded

// ── Global function for Quick Question buttons ──
function askQuestion(question) {
    const chatWindow = document.getElementById("chatWindow");
    const userMessageInput = document.getElementById("userMessage");

    // Open chat window if closed
    if (chatWindow.style.display === "none") {
        chatWindow.style.display = "flex";
    }

    // Set the question and trigger send
    userMessageInput.value = question;
    document.getElementById("sendMessage").click();
}
