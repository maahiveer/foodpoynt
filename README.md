# DecorPoynt - Modern Home Decor & Interior Design Blog

A beautifully designed blog website built with **Next.js** and **Supabase**. Features a clean, responsive design with a powerful admin panel for content management.

## ✨ Features

- **Beautiful Blog Frontend**: Clean, responsive design with modern typography and spacing
- **Admin Panel**: Secure authentication and content management
- **Rich Text Editor**: Create and edit articles with a powerful WYSIWYG editor
- **Article Management**: Draft, publish, edit, and delete articles
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic dark/light theme switching
- **SEO Optimized**: Meta tags, structured data, and optimized performance
- **Preview Mode**: Preview articles before publishing

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Database, Auth, Storage)
- **Rich Text Editor**: React Quill
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- Git installed

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd tracksatscale
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the SQL schema from `supabase-schema.sql` to create the necessary tables
4. Go to Settings > API to get your project URL and anon key

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog!

## 🎨 Customization

### Styling
The blog uses Tailwind CSS with custom components. You can customize:
- Colors in `app/globals.css`
- Typography and spacing
- Component styles in individual component files

### Branding
Update the following files to match your brand:
- `components/BlogHeader.tsx` - Logo and site name
- `components/BlogFooter.tsx` - Footer content
- `app/layout.tsx` - Site metadata

## 📝 Admin Panel Usage

### First Time Setup
1. Visit `/admin/login`
2. Sign up with your email and password
3. Check your email for verification (if email confirmation is enabled)
4. Access the admin dashboard at `/admin`

### Creating Articles
1. Go to "New Article" in the admin panel
2. Fill in the title, content, and other details
3. Use the rich text editor for formatting
4. Save as draft or publish immediately
5. Preview your article before publishing

### Managing Articles
- View all articles in the dashboard
- Edit existing articles
- Delete articles
- Change publication status

## 🗄️ Database Schema

The blog uses the following main tables:

- **articles**: Stores blog posts with content, metadata, and status
- **user_profiles**: User information and roles
- **categories**: Article categories (optional)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🔧 Development

### Project Structure

```
tracksatscale/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── articles/          # Article pages
│   └── preview/           # Article preview
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   └── blog/             # Blog components
├── lib/                   # Utilities and configurations
│   ├── supabase.ts       # Supabase client
│   └── auth.ts           # Authentication helpers
└── supabase-schema.sql   # Database schema
```

### Key Components

- **BlogHeader**: Navigation and user authentication
- **ArticleList**: Displays published articles
- **AdminDashboard**: Article management interface
- **ArticleEditor**: Rich text editor for creating/editing articles
- **RichTextEditor**: WYSIWYG editor component

## 🎯 Features in Detail

### Blog Frontend
- Responsive grid layout for articles
- Beautiful typography and spacing
- Dark/light mode support
- SEO-optimized article pages
- Reading time calculation
- Tag system

### Admin Panel
- Secure authentication with Supabase Auth
- Dashboard with article statistics
- Rich text editor with formatting options
- Article preview functionality
- Draft and publish workflow
- Image upload support
- Tag management

### Security
- Row Level Security (RLS) policies
- User authentication and authorization
- Protected admin routes
- Secure API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Check the Supabase documentation for backend issues

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Happy Blogging! 🚀**
