# Partners Carousel - Implementation Details

## 📸 Carousel Component Architecture

### File Location
`src/components/landing/PartnersCarousel.tsx`

### Features
- ✨ Automated sliding every 3 seconds
- 📱 Fully responsive (2-6 items per view)
- ♿ WCAG 2.1 Level AA accessible
- 🎨 Smooth CSS transitions
- ⌨️ Keyboard navigation support

---

## 🎯 Responsive Breakpoints

```
Mobile (< 640px)       : 2 logos per view
Tablet (640-1024px)    : 3 logos per view
Desktop (> 1024px)     : 4-6 logos per view
```

---

## 🎪 How It Works

### Auto-Scroll Logic
```
1. Every 3 seconds, carousel moves to next slide
2. When reaching end, loops back to start
3. Each slide shows N items (depends on viewport)
4. Smooth CSS transition animation (500ms)
```

### User Interaction
```
1. Click Previous (← button)
   → Carousel moves back 1 item
   → Auto-scroll pauses
   → Resumes after 5 seconds

2. Click Next (→ button)
   → Carousel moves forward 1 item
   → Auto-scroll pauses
   → Resumes after 5 seconds

3. Click Dot Indicator
   → Jumps to specific slide
   → Auto-scroll pauses
   → Resumes after 5 seconds

4. Mouse hover (desktop)
   → Auto-scroll pauses
   → Resumes when mouse leaves
```

---

## 🏗️ Component Structure

```tsx
<PartnersCarousel
  employers={employersArray}
  autoplay={true}              // Optional: default true
  autoplayInterval={5000}       // Optional: default 5000ms
>
  ↓
  Filters active employers
  ↓
  Groups featured first
  ↓
  Creates slides (itemsPerView)
  ↓
  Renders carousel UI with:
    - Visible items grid
    - Navigation buttons
    - Dot indicators
    - Auto-scroll logic
```

---

## 📊 Data Flow

### Input Data
```typescript
interface LandingEmployer {
  id: string;
  company_name: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  industry?: string;
  employee_count?: number;
  location?: string;
  is_featured: boolean;
  is_active: boolean;    // ← Only active employers shown
  order_index: number;
  created_at: string;
  updated_at: string;
}
```

### Processing Steps
```
1. Filter: is_active = true only
2. Sort: Featured first, then order_index
3. Group: Split into slides of N items
4. Display: Show current slide
5. Navigate: Move between slides
```

### Output
```
Carousel visible to user with:
- Company logos in a grid
- Auto-scrolling slides
- Navigation controls
- Smooth animations
```

---

## 🎨 Visual Design

### Logo Card Styling
```
┌─────────────────────────┐
│                         │
│    Company Logo         │ ← Hover: scale 1.1, darken bg
│    (centered)           │
│                         │
│  ────────────────────   │
│  Company Name ×         │ ← Shows on hover
│  Location               │
│                         │
└─────────────────────────┘
```

### Navigation Buttons
```
← [Primary] Logo Grid [Primary] →
  48×48px min touch target
  Rounded corners
  Hover: Scale 1.05, shadow increase
```

### Dot Indicators
```
○ ○ ● ○ ○    ← Filled = current slide
                Draggable/clickable
                Smooth width animation
```

---

## ⚡ Performance Optimization

### Rendering
- Only visible items rendered
- Others removed from DOM (not hidden)
- Reduces memory usage
- Faster interactions

### Animations
- CSS transitions (GPU accelerated)
- No JavaScript animations
- Smooth 500ms duration
- `transform: translateX()` used for performance

### Event Handling
- Event delegation
- No memory leaks
- Cleanup on unmount
- Responsive resize handling

---

## ♿ Accessibility Implementation

### Keyboard Navigation
- ← → Arrow keys: Move carousel
- Tab key: Reach buttons and dots
- Enter/Space: Activate button

### Screen Readers
- ARIA labels on all buttons
- Role="img" on logo containers
- Alt text descriptions
- Focus announcements

### Touch Targets
- Minimum 48×48 pixels
- WCAG 2.1 Level AA compliant
- Proper spacing for mobile

### Focus Management
- Visible focus rings
- Logical tab order
- Focus trapped in carousel

---

## 🔧 Customization Options

### Change Auto-play Speed
```tsx
<PartnersCarousel
  employers={employers}
  autoplayInterval={4000}  // 4 seconds instead of 5
/>
```

### Disable Auto-play
```tsx
<PartnersCarousel
  employers={employers}
  autoplay={false}  // Manual navigation only
/>
```

### Change Items Per View
Edit this in component:
```tsx
const itemsPerView = isMobile ? 2 : isTablet ? 3 : 6;
```

---

## 🐛 Common Issues & Solutions

### Issue: Carousel Not Scrolling
**Check:**
- Is `is_active = true` for employers?
- Are there enough employers?
- Try adding 5+ employers to see effect

### Issue: Logos Stretched/Distorted
**Solution:**
- Use square aspect ratio logos (1:1)
- Or 16:9 aspect ratio
- CSS uses `object-contain` (maintains ratio)

### Issue: Carousel Not Responsive
**Check:**
- Viewport set correctly: `<meta name="viewport" content="width=device-width">`
- CSS media queries loading
- Try browser refresh (F5)

### Issue: Autoplay Stops
**Check:**
- Is JavaScript enabled?
- Console errors? (F12 → Console)
- Try clearing browser cache

---

## 📈 Monitoring & Analytics

### Tracking Carousel Usage
```javascript
// Track when user interacts with carousel
document.addEventListener('click', (e) => {
  if (e.target.closest('.carousel-button')) {
    gtag('event', 'carousel_interaction', {
      action: e.target.dataset.action,
      timestamp: new Date().toISOString()
    });
  }
});
```

### Metrics to Track
- Navigation button clicks
- Dot indicator clicks
- How long users view carousel
- Most viewed employers (by position)

---

## 🚀 Deployment Checklist

- [ ] All employer logos have valid URLs
- [ ] Featured employers correctly marked
- [ ] Active toggle set for public employers
- [ ] Tested on mobile devices
- [ ] Tested with keyboard navigation
- [ ] Tested with screen reader
- [ ] Touch targets ≥48px verified
- [ ] Autoplay working
- [ ] Navigation buttons responsive
- [ ] No console errors
- [ ] Build completes successfully

---

## 💾 Data Backup

### Export Employers
```sql
SELECT * FROM landing_employers 
WHERE is_active = true 
ORDER BY is_featured DESC, order_index ASC;
```

### Restore from Backup
```sql
INSERT INTO landing_employers (
  company_name, logo_url, description, 
  website_url, industry, employee_count, 
  location, is_featured, order_index, is_active
) VALUES
  ('Company A', 'url1', 'desc', ...),
  ('Company B', 'url2', 'desc', ...);
```

---

## 📚 References

- **Carousel Pattern**: https://www.w3.org/WAI/tutorials/carousels/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Next.js Image**: https://nextjs.org/docs/basic-features/image-optimization
- **Responsive Design**: https://web.dev/responsive-web-design-basics/

---

## 🎓 Learning Resources

### CSS Transitions
- Used for smooth animations
- GPU accelerated with `transform` property
- Reduces jank on mobile

### Flexbox/Grid
- Layout partners in grid
- Responsive without media queries
- Modern browser support

### JavaScript Events
- Event listeners for navigation
- Event delegation for efficiency
- Memory leak prevention

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial carousel implementation |
| | | - Auto-scroll feature |
| | | - Responsive 2-6 items |
| | | - WCAG 2.1 AA compliant |
| | | - Touch & keyboard support |

---

## 📞 Technical Support

For implementation questions:
1. Check component source code
2. Review inline comments
3. Test in different browsers
4. Check console for errors
5. Verify Supabase connection

---

**Last Updated**: January 31, 2026  
**Component Status**: ✅ Production Ready
