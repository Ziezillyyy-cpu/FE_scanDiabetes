# ============================================================
# setup-frontend.ps1 – Jalankan dari folder FE_scanDiabetes
# ============================================================

Write-Host "=== VisioPed Frontend Setup ===" -ForegroundColor Cyan

# 1. Install expo-secure-store
Write-Host "`n[1/2] Install expo-secure-store..." -ForegroundColor Yellow
npx expo install expo-secure-store

Write-Host "`n=== Setup FE SELESAI! ===" -ForegroundColor Green
Write-Host "Jalankan frontend dengan: npx expo start" -ForegroundColor Green
