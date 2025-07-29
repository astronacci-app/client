# Next.js Authentication Frontend

Frontend aplikasi dengan fitur login menggunakan email/password dan Google OAuth.

## Fitur

- ✅ Login dengan email dan password
- ✅ Login dengan Google OAuth
- ✅ Redirect otomatis berdasarkan status autentikasi
- ✅ UI modern dengan Tailwind CSS v3
- ✅ Dashboard sederhana setelah login
- ✅ Logout functionality

## Prerequisites

- Node.js 18+ 
- Backend API yang berjalan di `http://localhost:3000`
- Google OAuth Client ID (opsional untuk Google login)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Salin file `.env.local` dan atur variabel berikut:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Google OAuth Configuration (opsional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 3. Google OAuth Setup (Opsional)

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih yang sudah ada
3. Enable Google+ API
4. Buat OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized origins: `http://localhost:3001`
   - Authorized redirect URIs: `http://localhost:3001`
5. Salin Client ID ke file `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:3001`

## API Endpoints

Frontend ini terhubung ke endpoint berikut:

### Regular Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Google Login
```
POST http://localhost:3000/api/auth/google-login
Content-Type: application/json

{
  "token": "google-id-token"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Struktur Project

```
src/
├── app/
│   ├── login/          # Halaman login
│   ├── dashboard/      # Dashboard setelah login
│   ├── globals.css     # Global styles dengan Tailwind
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page (redirect logic)
├── lib/
│   ├── auth.ts         # Authentication utilities
│   └── google-auth.ts  # Google OAuth utilities
```

## Teknologi

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Styling
- **Axios** - HTTP client
- **js-cookie** - Cookie management
- **Google Identity Services** - Google OAuth

## Cara Penggunaan

1. Buka `http://localhost:3001`
2. Akan redirect ke halaman login
3. Login dengan:
   - Email/password, atau
   - Tombol "Sign in with Google"
4. Setelah berhasil, redirect ke dashboard
5. Klik "Logout" untuk keluar

## Troubleshooting

### Google Login tidak muncul
- Pastikan `NEXT_PUBLIC_GOOGLE_CLIENT_ID` sudah diset di `.env.local`
- Cek browser console untuk error
- Pastikan domain sudah terdaftar di Google Console

### Login gagal
- Pastikan backend API berjalan di `http://localhost:3000`
- Cek network tab di browser untuk response error
- Pastikan endpoint `/api/auth/login` dan `/api/auth/google-login` tersedia

### Styling tidak muncul
- Jalankan `npm run build` untuk check Tailwind config
- Pastikan `tailwind.config.ts` sudah benar
- Restart development server
