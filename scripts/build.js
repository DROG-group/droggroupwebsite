const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SITE_DIR = path.join(__dirname, '..', 'site');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const PARTIALS_DIR = path.join(__dirname, 'partials');

// Load YAML data files
function loadYaml(filepath) {
  if (!fs.existsSync(filepath)) {
    console.warn(`Warning: ${filepath} not found`);
    return {};
  }
  const content = fs.readFileSync(filepath, 'utf8');
  return YAML.parse(content);
}

// Load partial HTML files
const partials = {};
function loadPartials() {
  const partialFiles = ['head', 'header', 'footer', 'scripts'];
  partialFiles.forEach(name => {
    const filepath = path.join(PARTIALS_DIR, `${name}.html`);
    if (fs.existsSync(filepath)) {
      partials[name] = fs.readFileSync(filepath, 'utf8');
    }
  });
}

// Inject partials into template
function injectPartials(html) {
  return html
    .replace(/\{\{>head\}\}/g, partials.head || '')
    .replace(/\{\{>header\}\}/g, partials.header || '')
    .replace(/\{\{>footer\}\}/g, partials.footer || '')
    .replace(/\{\{>scripts\}\}/g, partials.scripts || '');
}

// Generate navigation links
function generateNavLinks(nav) {
  return nav.map(item =>
    `<a href="${item.url}" class="nav-link">${item.text}</a>`
  ).join('\n        ');
}

// Generate footer navigation links
function generateFooterNavLinks(nav) {
  return nav.map(item =>
    `<a href="${item.url}">${item.text}</a>`
  ).join('\n        ');
}

// Generate stats HTML
function generateStats(stats) {
  return stats.map((stat, i) => `
        <div class="stat-item" data-aos="fade-up" data-aos-delay="${i * 50}">
          <div class="stat-value">${stat.value}</div>
          <div class="stat-label">${stat.label}</div>
        </div>`
  ).join('\n');
}

// Generate about points
function generateAboutPoints(points) {
  return points.map((point, i) => `
        <div class="card" data-aos="fade-up" data-aos-delay="${i * 100}">
          <h4>${point.title}</h4>
          <p>${point.description}</p>
        </div>`
  ).join('\n');
}

// Generate social links for footer
function generateSocialLinks(social) {
  const icons = {
    linkedin: 'fab fa-linkedin',
    twitter: 'fab fa-twitter',
    instagram: 'fab fa-instagram',
    facebook: 'fab fa-facebook',
    github: 'fab fa-github'
  };
  return social.map(s =>
    `<a href="${s.url}" target="_blank"><i class="${icons[s.platform] || 'fas fa-link'}"></i></a>`
  ).join('\n          ');
}

// Generate footer social links (with text)
function generateFooterSocialLinks(social) {
  const names = {
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    instagram: 'Instagram',
    facebook: 'Facebook',
    github: 'GitHub'
  };
  const icons = {
    linkedin: 'fab fa-linkedin',
    twitter: 'fab fa-twitter',
    instagram: 'fab fa-instagram',
    facebook: 'fab fa-facebook',
    github: 'fab fa-github'
  };
  return social.map(s =>
    `<a href="${s.url}" target="_blank"><i class="${icons[s.platform] || 'fas fa-link'}"></i> ${names[s.platform] || s.platform}</a>`
  ).join('\n        ');
}

// Generate location addresses
function generateLocations(locations) {
  return locations.map(loc =>
    `<p><strong>${loc.name}</strong><br>${loc.address.replace(/\n/g, '<br>')}</p>`
  ).join('\n        ');
}

// Generate roles HTML (for community page)
function generateRoles(roles) {
  return roles.map(role => `
        <div class="service-card">
          <div class="card-icon">
            <i class="${role.icon}"></i>
          </div>
          <h3>${role.title}</h3>
          <p>${role.description}</p>
          <a href="contact.html" class="btn btn-outline-dark btn-sm">${role.cta}</a>
        </div>`
  ).join('\n');
}

// Generate benefits HTML (for community page)
function generateBenefits(benefits) {
  return benefits.map(benefit => `
        <div class="card">
          <h4>${benefit.title}</h4>
          <p>${benefit.description}</p>
        </div>`
  ).join('\n');
}

// Generate blog posts HTML
function generatePosts(posts) {
  return posts.map((post, i) => `
        <div class="blog-card" data-category="${post.category || 'all'}" data-aos="fade-up" data-aos-delay="${i * 100}">
          ${post.category ? `<span class="blog-category">${post.category.replace('-', ' ')}</span>` : ''}
          <h3 style="text-transform: none; font-family: 'Comfortaa', sans-serif; font-size: 1.5rem; margin-bottom: 8px;">${post.title}</h3>
          ${post.subtitle ? `<h5 style="color: var(--color-primary); margin-bottom: 16px; text-transform: none;">${post.subtitle}</h5>` : ''}
          <p>${post.excerpt}</p>
          ${post.tags ? `<div class="blog-tags">${post.tags.map(t => `<span class="blog-tag">${t}</span>`).join('')}</div>` : ''}
          <a href="post/${post.slug}.html" class="btn btn-outline-dark btn-sm">Read More</a>
        </div>`
  ).join('\n');
}

// Generate blog category filters
function generateBlogCategories(categories) {
  return categories.map((cat, i) => `
        <button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${cat.id}">
          <i class="${cat.icon}"></i> ${cat.name}
        </button>`
  ).join('\n');
}

// Generate GEP sections HTML
function generateGepSections(sections) {
  return sections.map((section, i) => `
        <div class="policy-card" data-aos="fade-up" data-aos-delay="${i * 50}">
          <span class="policy-number">${section.number}</span>
          <h4>${section.title}</h4>
          ${section.subtitle ? `<p class="subtitle">${section.subtitle}</p>` : ''}
          <ul>
            ${section.items.map(item => `<li>${item}</li>`).join('\n            ')}
          </ul>
        </div>`
  ).join('\n');
}

// Generate contact reasons HTML
function generateReasons(reasons) {
  return reasons.map(reason => `
        <div class="card" style="text-align: center;">
          <div class="card-icon" style="margin: 0 auto 20px;">
            <i class="${reason.icon}"></i>
          </div>
          <h4>${reason.title}</h4>
          <p>${reason.description}</p>
        </div>`
  ).join('\n');
}

// Generate contact locations HTML
function generateContactLocations(locations) {
  return locations.map(loc => `
          <div style="margin-bottom: 16px;">
            <p style="color: var(--color-white);"><i class="fas fa-map-marker-alt" style="color: var(--color-mint); width: 24px;"></i> <strong>${loc.name}</strong><br>
            <span style="opacity: 0.8; margin-left: 24px;">${loc.address.replace(/\n/g, '<br><span style="margin-left: 24px;">')}</span></p>
          </div>`
  ).join('\n');
}

// Generate intro points HTML (for DIM page)
function generateIntroPoints(points) {
  return points.map(point => `
        <div class="card">
          <h4>${point.title}</h4>
          ${point.description ? `<p>${point.description}</p>` : ''}
        </div>`
  ).join('\n');
}

// Generate generations HTML (for DIM page)
function generateGenerations(generations) {
  return generations.map(gen => `
        <div class="gen-card">
          <div class="gen-header">
            <div class="gen-number">${gen.gen}</div>
            <div class="gen-meta">
              <div class="gen-year">Since ${gen.year}</div>
              <div class="gen-solution">${gen.solution}</div>
            </div>
          </div>
          <div class="gen-grid">
            <div class="gen-item">
              <div class="gen-item-label">Problem</div>
              <div class="gen-item-value">${gen.problem}</div>
            </div>
            <div class="gen-item">
              <div class="gen-item-label">Deficit Model</div>
              <div class="gen-item-value">${gen.deficit_model}</div>
            </div>
            <div class="gen-item">
              <div class="gen-item-label">Generation</div>
              <div class="gen-item-value">Gen ${gen.gen}</div>
            </div>
          </div>
          <div class="gen-description">${gen.description}</div>
        </div>`
  ).join('\n');
}

// Generate privacy sections HTML
function generatePrivacySections(sections) {
  return sections.map((section, i) => `
        <div class="policy-card" data-aos="fade-up" data-aos-delay="${i * 50}">
          <h4>${section.title}</h4>
          <p>${section.content}</p>
        </div>`
  ).join('\n');
}

// Generate relative nav links (for post pages in subdirectory)
function generateNavLinksRelative(nav) {
  return nav.map(item =>
    `<a href="../${item.url}" class="nav-link">${item.text}</a>`
  ).join('\n        ');
}

// Generate relative footer nav links
function generateFooterNavLinksRelative(nav) {
  return nav.map(item =>
    `<a href="../${item.url}">${item.text}</a>`
  ).join('\n        ');
}

// Generate mission points HTML (for team page)
function generateMissionPoints(points) {
  return points.map((point, i) => `
        <div class="mission-card" data-aos="fade-up" data-aos-delay="${i * 100}">
          <div class="mission-icon">
            <i class="${point.icon}"></i>
          </div>
          <h4>${point.title}</h4>
          <p>${point.description}</p>
        </div>`
  ).join('\n');
}

// Generate team cards HTML
function generateTeamCards(team) {
  return team.map((member, i) => `
        <div class="team-card" data-aos="fade-up" data-aos-delay="${i * 100}">
          <div class="team-image"></div>
          <div class="team-content">
            <h4>${member.name}</h4>
            <p class="team-role">${member.role}</p>
            <p class="team-bio">${member.bio}</p>
            <div class="team-social">
              ${member.social?.linkedin ? `<a href="${member.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
              ${member.social?.twitter ? `<a href="${member.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
            </div>
          </div>
        </div>`
  ).join('\n');
}

// Generate partners HTML
function generatePartners(partners) {
  return partners.map((partner, i) => `
        <div class="partner-item" data-aos="fade-up" data-aos-delay="${i * 50}">
          <h5>${partner.name}</h5>
          <p>${partner.description}</p>
        </div>`
  ).join('\n');
}

// Generate story content HTML
function generateStoryContent(content) {
  if (!content) return '';
  return content.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('\n');
}

// Generate resource category filters
function generateCategoryFilters(categories) {
  return categories.map((cat, i) => `
        <button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${cat.id}">
          <i class="${cat.icon}"></i> ${cat.name}
        </button>`
  ).join('\n');
}

// Generate resources HTML
function generateResources(resources) {
  return resources.map((res, i) => `
        <div class="resource-card${res.featured ? ' featured' : ''}" data-category="${res.category}" data-aos="fade-up" data-aos-delay="${i * 50}">
          <span class="resource-type">${res.type}</span>
          <h4>${res.title}</h4>
          <p>${res.description}</p>
          <a href="${res.link}" class="btn btn-outline-dark btn-sm" ${res.link.startsWith('http') ? 'target="_blank"' : ''}>${res.type === 'Game' ? 'Play Now' : res.type === 'PDF' ? 'Download' : 'Learn More'}</a>
        </div>`
  ).join('\n');
}

// Generate upcoming events HTML
function generateUpcomingEvents(events) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return events.map((event, i) => {
    const date = new Date(event.date);
    return `
        <div class="event-card${event.featured ? ' featured' : ''}" data-aos="fade-up" data-aos-delay="${i * 100}">
          <div class="event-date">
            <span class="day">${date.getDate()}</span>
            <span class="month">${months[date.getMonth()]}</span>
          </div>
          <div class="event-content">
            <span class="event-type">${event.type}</span>
            <h4>${event.title}</h4>
            <p>${event.description}</p>
            <div class="event-meta">
              <span><i class="fas fa-clock"></i> ${event.time}</span>
              <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
            </div>
            <a href="${event.link}" class="btn btn-primary btn-sm">Register</a>
          </div>
        </div>`;
  }).join('\n');
}

// Generate past events HTML
function generatePastEvents(events) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return events.map((event, i) => {
    const date = new Date(event.date);
    return `
        <div class="event-card" data-aos="fade-up" data-aos-delay="${i * 50}">
          <div class="event-date">
            <span class="day">${date.getDate()}</span>
            <span class="month">${months[date.getMonth()]}</span>
          </div>
          <div class="event-content">
            <span class="event-type">${event.type}</span>
            <h4>${event.title}</h4>
            <p>${event.description}</p>
            <div class="event-meta">
              <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
            </div>
          </div>
        </div>`;
  }).join('\n');
}

// Generate role filter options
function generateRoleFilters(roles) {
  return roles.map(role =>
    `<option value="${role.id}">${role.name}</option>`
  ).join('\n            ');
}

// Generate country filter options
function generateCountryFilters(countries) {
  return countries.map(country =>
    `<option value="${country.id}">${country.name}</option>`
  ).join('\n            ');
}

// Generate member cards HTML
function generateMemberCards(members) {
  const icons = {
    linkedin: 'fab fa-linkedin',
    twitter: 'fab fa-twitter',
    github: 'fab fa-github'
  };

  const roleLabels = {
    'practitioner': 'Practitioner',
    'scientist': 'Scientist',
    'donor': 'Donor',
    'artist': 'Artist',
    'creative-tech': 'Creative Tech'
  };

  return members.map((member, i) => {
    const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const expertiseTags = (member.expertise || []).map(exp =>
      `<span class="expertise-tag">${exp}</span>`
    ).join('\n              ');

    const socialLinks = Object.entries(member.social || {}).map(([platform, url]) =>
      `<a href="${url}" target="_blank" title="${platform}"><i class="${icons[platform] || 'fas fa-link'}"></i></a>`
    ).join('\n              ');

    return `
        <div class="member-card" data-role="${member.role}" data-country="${member.country}" data-name="${member.name}" data-org="${member.organization || ''}" data-aos="fade-up" data-aos-delay="${i * 50}">
          <div class="member-header">
            <div class="member-avatar">${initials}</div>
            <div class="member-info">
              <h4>${member.name}</h4>
              <span class="member-role">${roleLabels[member.role] || member.role}</span>
              <p class="member-org">${member.organization || ''}</p>
            </div>
          </div>
          <p class="member-bio">${member.bio}</p>
          ${expertiseTags ? `<div class="member-expertise">${expertiseTags}</div>` : ''}
          ${socialLinks ? `<div class="member-social">${socialLinks}</div>` : ''}
        </div>`;
  }).join('\n');
}

// Replace all placeholders in HTML
function replacePlaceholders(html, replacements) {
  // First inject partials
  html = injectPartials(html);
  // Then replace placeholders
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value || '');
  }
  return html;
}

// Build index page
function buildIndex(siteData) {
  console.log('Building index.html...');

  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const hero = siteData.hero || {};
  const about = siteData.about || {};
  const footer = siteData.footer || {};
  const stats = siteData.stats || [];

  const templatePath = path.join(__dirname, 'template.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_TITLE}}': site.tagline,
    '{{PAGE_DESCRIPTION}}': site.description,
    '{{PAGE_SLUG}}': 'index.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_TAGLINE}}': site.tagline,
    '{{SITE_DESCRIPTION}}': site.description,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{SITE_PHONE}}': site.phone,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{STATS}}': generateStats(stats),
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{CTA_PRIMARY_TEXT}}': hero.cta_primary?.text,
    '{{CTA_PRIMARY_URL}}': hero.cta_primary?.url,
    '{{CTA_SECONDARY_TEXT}}': hero.cta_secondary?.text,
    '{{CTA_SECONDARY_URL}}': hero.cta_secondary?.url,
    '{{ABOUT_TITLE}}': about.title,
    '{{ABOUT_DESCRIPTION}}': about.description,
    '{{ABOUT_POINTS}}': generateAboutPoints(about.points || []),
    '{{TYPED_WORDS}}': JSON.stringify(hero.typed_words || ['Practitioners', 'Scientists', 'Donors', 'Artists', 'Creative Techs']),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), html);
  console.log('  Built: index.html');
}

// Build community page
function buildCommunity(siteData) {
  console.log('Building community.html...');

  const pageData = loadYaml(path.join(DATA_DIR, 'pages', 'community.yaml'));
  const membersData = loadYaml(path.join(DATA_DIR, 'members.yaml'));
  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};
  const page = pageData.page || {};
  const hero = pageData.hero || {};
  const roles = pageData.roles || [];
  const benefits = pageData.benefits || [];
  const filters = membersData.filters || {};
  const members = membersData.members || [];

  const templatePath = path.join(TEMPLATES_DIR, 'community.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_SLUG}}': 'community.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{PAGE_TITLE}}': page.title,
    '{{PAGE_DESCRIPTION}}': page.description,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{ROLES}}': generateRoles(roles),
    '{{BENEFITS}}': generateBenefits(benefits),
    '{{ROLE_FILTERS}}': generateRoleFilters(filters.roles || []),
    '{{COUNTRY_FILTERS}}': generateCountryFilters(filters.countries || []),
    '{{MEMBER_CARDS}}': generateMemberCards(members),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'community.html'), html);
  console.log('  Built: community.html');
}

// Build blog page
function buildBlog(siteData) {
  console.log('Building blog.html...');

  const pageData = loadYaml(path.join(DATA_DIR, 'pages', 'blog.yaml'));
  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};
  const page = pageData.page || {};
  const hero = pageData.hero || {};
  const posts = pageData.posts || [];
  const categories = pageData.categories || [];

  const templatePath = path.join(TEMPLATES_DIR, 'blog.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_SLUG}}': 'blog.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{PAGE_TITLE}}': page.title,
    '{{PAGE_DESCRIPTION}}': page.description,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{BLOG_CATEGORIES}}': generateBlogCategories(categories),
    '{{POSTS}}': generatePosts(posts),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'blog.html'), html);
  console.log('  Built: blog.html');
}

// Build contact page
function buildContact(siteData) {
  console.log('Building contact.html...');

  const pageData = loadYaml(path.join(DATA_DIR, 'pages', 'contact.yaml'));
  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};
  const page = pageData.page || {};
  const hero = pageData.hero || {};
  const contactInfo = pageData.contact_info || {};
  const reasons = pageData.reasons || [];
  const locations = pageData.locations || [];

  const templatePath = path.join(TEMPLATES_DIR, 'contact.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_SLUG}}': 'contact.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{PAGE_TITLE}}': page.title,
    '{{PAGE_DESCRIPTION}}': page.description,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{CONTACT_EMAIL}}': contactInfo.email,
    '{{CONTACT_PHONE}}': contactInfo.phone,
    '{{FORMSPREE_ID}}': contactInfo.formspree_id || 'your-form-id',
    '{{REASONS}}': generateReasons(reasons),
    '{{CONTACT_LOCATIONS}}': generateContactLocations(locations),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'contact.html'), html);
  console.log('  Built: contact.html');
}

// Build Privacy page
function buildPrivacy(siteData) {
  console.log('Building privacy.html...');

  const pageData = loadYaml(path.join(DATA_DIR, 'pages', 'privacy.yaml'));
  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};
  const page = pageData.page || {};
  const hero = pageData.hero || {};
  const sections = pageData.sections || [];

  const templatePath = path.join(TEMPLATES_DIR, 'privacy.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_SLUG}}': 'privacy.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{PAGE_TITLE}}': page.title,
    '{{PAGE_DESCRIPTION}}': page.description,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{PRIVACY_SECTIONS}}': generatePrivacySections(sections),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'privacy.html'), html);
  console.log('  Built: privacy.html');
}

// Build blog posts
function buildPosts(siteData) {
  console.log('Building blog posts...');

  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};

  // Ensure post directory exists
  const postDir = path.join(SITE_DIR, 'post');
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }

  // Get all post YAML files
  const postsDir = path.join(DATA_DIR, 'posts');
  if (!fs.existsSync(postsDir)) {
    console.log('  No posts directory found');
    return;
  }

  const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.yaml'));
  const templatePath = path.join(TEMPLATES_DIR, 'post.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  for (const postFile of postFiles) {
    const postData = loadYaml(path.join(postsDir, postFile));
    let html = template;

    const replacements = {
      '{{PATH_PREFIX}}': '../',
      '{{PAGE_TITLE}}': postData.title,
      '{{PAGE_DESCRIPTION}}': postData.excerpt,
      '{{PAGE_SLUG}}': `post/${postData.slug}.html`,
      '{{SITE_NAME}}': site.name,
      '{{SITE_URL}}': site.url,
      '{{SITE_EMAIL}}': site.email,
      '{{POST_TITLE}}': postData.title,
      '{{POST_SUBTITLE_HTML}}': postData.subtitle ? `<p class="hero-subtitle" style="color: var(--color-mint);">${postData.subtitle}</p>` : '',
      '{{POST_SLUG}}': postData.slug,
      '{{POST_DATE}}': postData.date,
      '{{POST_AUTHOR}}': postData.author,
      '{{POST_EXCERPT}}': postData.excerpt,
      '{{POST_CONTENT}}': postData.content,
      '{{NAV_LINKS}}': generateNavLinksRelative(nav),
      '{{FOOTER_DESCRIPTION}}': footer.description,
      '{{FOOTER_NAV_LINKS}}': generateFooterNavLinksRelative(nav),
      '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
      '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
      '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
      '{{FOOTER_LEGAL}}': footer.legal
    };

    html = replacePlaceholders(html, replacements);
    fs.writeFileSync(path.join(postDir, `${postData.slug}.html`), html);
    console.log(`  Built: post/${postData.slug}.html`);
  }
}

// Build Resources page
function buildResources(siteData) {
  console.log('Building resources.html...');

  const pageData = loadYaml(path.join(DATA_DIR, 'pages', 'resources.yaml'));
  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};
  const page = pageData.page || {};
  const hero = pageData.hero || {};
  const categories = pageData.categories || [];
  const resources = pageData.resources || [];

  const templatePath = path.join(TEMPLATES_DIR, 'resources.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_SLUG}}': 'resources.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{PAGE_TITLE}}': page.title,
    '{{PAGE_DESCRIPTION}}': page.description,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{CATEGORY_FILTERS}}': generateCategoryFilters(categories),
    '{{RESOURCES}}': generateResources(resources),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'resources.html'), html);
  console.log('  Built: resources.html');
}

// Build Events page
function buildEvents(siteData) {
  console.log('Building events.html...');

  const pageData = loadYaml(path.join(DATA_DIR, 'pages', 'events.yaml'));
  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};
  const page = pageData.page || {};
  const hero = pageData.hero || {};
  const events = pageData.events || [];
  const pastEvents = pageData.past_events || [];

  const templatePath = path.join(TEMPLATES_DIR, 'events.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_SLUG}}': 'events.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{PAGE_TITLE}}': page.title,
    '{{PAGE_DESCRIPTION}}': page.description,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{UPCOMING_EVENTS}}': generateUpcomingEvents(events),
    '{{PAST_EVENTS}}': generatePastEvents(pastEvents),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'events.html'), html);
  console.log('  Built: events.html');
}

// Build Team/About page
function buildTeam(siteData) {
  console.log('Building team.html...');

  const pageData = loadYaml(path.join(DATA_DIR, 'pages', 'team.yaml'));
  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};
  const page = pageData.page || {};
  const hero = pageData.hero || {};
  const mission = pageData.mission || {};
  const story = pageData.story || {};
  const team = pageData.team || [];
  const partners = pageData.partners || [];

  const templatePath = path.join(TEMPLATES_DIR, 'team.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_SLUG}}': 'team.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{PAGE_TITLE}}': page.title,
    '{{PAGE_DESCRIPTION}}': page.description,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{MISSION_TITLE}}': mission.title,
    '{{MISSION_DESCRIPTION}}': mission.description,
    '{{MISSION_POINTS}}': generateMissionPoints(mission.points || []),
    '{{STORY_TITLE}}': story.title,
    '{{STORY_CONTENT}}': generateStoryContent(story.content),
    '{{TEAM_CARDS}}': generateTeamCards(team),
    '{{PARTNERS}}': generatePartners(partners),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'team.html'), html);
  console.log('  Built: team.html');
}

// Build DIM page
function buildDim(siteData) {
  console.log('Building dim.html...');

  const pageData = loadYaml(path.join(DATA_DIR, 'pages', 'dim.yaml'));
  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};
  const page = pageData.page || {};
  const hero = pageData.hero || {};
  const intro = pageData.intro || {};
  const generations = pageData.generations || [];

  const templatePath = path.join(TEMPLATES_DIR, 'dim.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_SLUG}}': 'dim.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{PAGE_TITLE}}': page.title,
    '{{PAGE_DESCRIPTION}}': page.description,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{INTRO_TITLE}}': intro.title,
    '{{INTRO_POINTS}}': generateIntroPoints(intro.points || []),
    '{{GENERATIONS}}': generateGenerations(generations),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'dim.html'), html);
  console.log('  Built: dim.html');
}

// Build GEP page
function buildGep(siteData) {
  console.log('Building gep.html...');

  const pageData = loadYaml(path.join(DATA_DIR, 'pages', 'gep.yaml'));
  const site = siteData.site || {};
  const nav = siteData.nav || [];
  const footer = siteData.footer || {};
  const page = pageData.page || {};
  const hero = pageData.hero || {};
  const sections = pageData.sections || [];

  const templatePath = path.join(TEMPLATES_DIR, 'gep.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PATH_PREFIX}}': '',
    '{{PAGE_SLUG}}': 'gep.html',
    '{{SITE_NAME}}': site.name,
    '{{SITE_URL}}': site.url,
    '{{SITE_EMAIL}}': site.email,
    '{{PAGE_TITLE}}': page.title,
    '{{PAGE_DESCRIPTION}}': page.description,
    '{{NAV_LINKS}}': generateNavLinks(nav),
    '{{HERO_HEADLINE}}': hero.headline,
    '{{HERO_SUBHEADLINE}}': hero.subheadline,
    '{{HERO_DESCRIPTION}}': hero.description,
    '{{GEP_SECTIONS}}': generateGepSections(sections),
    '{{FOOTER_DESCRIPTION}}': footer.description,
    '{{FOOTER_NAV_LINKS}}': generateFooterNavLinks(nav),
    '{{SOCIAL_LINKS}}': generateSocialLinks(footer.social || []),
    '{{FOOTER_SOCIAL_LINKS}}': generateFooterSocialLinks(footer.social || []),
    '{{FOOTER_LOCATIONS}}': generateLocations(footer.locations || []),
    '{{FOOTER_LEGAL}}': footer.legal
  };

  html = replacePlaceholders(html, replacements);
  fs.writeFileSync(path.join(SITE_DIR, 'gep.html'), html);
  console.log('  Built: gep.html');
}

// Main build function
function build() {
  console.log('Building drog.group website...\n');

  // Load partials
  loadPartials();

  // Load main site data
  const siteData = loadYaml(path.join(DATA_DIR, 'site.yaml'));

  // Build all pages
  buildIndex(siteData);
  buildCommunity(siteData);
  buildBlog(siteData);
  buildContact(siteData);
  buildDim(siteData);
  buildPrivacy(siteData);
  buildPosts(siteData);
  buildTeam(siteData);
  buildResources(siteData);
  buildEvents(siteData);
  buildGep(siteData);

  console.log('\nBuild complete!');
}

build();
