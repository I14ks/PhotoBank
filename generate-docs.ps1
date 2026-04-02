$doxygenPath = "C:\Program Files\doxygen\bin\doxygen.exe"
$projectPath = "c:\MIREA\6\Системная и программная инженерия\Project\PhotoBank"
$doxyfilePath = Join-Path $projectPath "Doxyfile"

Write-Host "========================================"
Write-Host "  PhotoBank Documentation Generator"
Write-Host "========================================"
Write-Host ""

# Генерация Doxygen документации (Frontend + Backend)
Write-Host "[1/3] Generating Doxygen documentation..."

# Создаём временную папку с коротким именем без кириллицы
$tempRoot = "c:\temp\photobank-docs"
$tempPath = Join-Path $tempRoot "work"
$tempSrc = Join-Path $tempPath "src"
$tempBackend = Join-Path $tempPath "backend"
$tempDoxyfile = Join-Path $tempPath "Doxyfile"

# Очищаем и создаём структуру
if (Test-Path $tempRoot) {
    Remove-Item $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $tempPath -Force | Out-Null

# Создаём символические ссылки на исходные папки
# Используем robocopy для копирования без кириллицы в путях
# Исключаем README.md и другие ненужные файлы
robocopy "$(Join-Path $projectPath 'src')" $tempSrc /E /NFL /NDL /NJH /NJS /XF *.md | Out-Null
robocopy "$(Join-Path $projectPath 'backend')" $tempBackend /E /NFL /NDL /NJH /NJS /XD __pycache__ /XF *.md | Out-Null

# Копируем Doxyfile
Copy-Item $doxyfilePath $tempDoxyfile -Force

# Обновляем OUTPUT_DIRECTORY на абсолютный путь
$content = Get-Content $tempDoxyfile -Raw
$content = $content -replace 'OUTPUT_DIRECTORY\s*=\s*".*"', "OUTPUT_DIRECTORY = `"$($projectPath)\docs\doxygen`""
# Удаляем USE_MDFILE_AS_MAINPAGE если есть
$content = $content -replace '(?m)^USE_MDFILE_AS_MAINPAGE\s*=.*\r?\n', ''
# Удаляем README.md из INPUT
$content = $content -replace '(?m)^README\.md\r?\n', ''
# Удаляем неподдерживаемые теги
$content = $content -replace '(?m)^EXTRACT_FUNCTIONS\s*=.*\r?\n', ''
$content = $content -replace '(?m)^EXTRACT_CONSTANTS\s*=.*\r?\n', ''
$content = $content -replace '(?m)^IF_SET_SOURCE_PATH\s*=.*\r?\n', ''
$content = $content -replace '(?m)^EXTENSION_MAPPING\s*=.*\\s+py=Python.*\r?\n', ''
Set-Content $tempDoxyfile $content -NoNewline

# Запускаем Doxygen из временной папки
$originalLocation = Get-Location
Set-Location $tempPath

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $doxygenPath
$psi.Arguments = "Doxyfile"
$psi.WorkingDirectory = $tempPath
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $psi
$process.Start() | Out-Null
$output = $process.StandardOutput.ReadToEnd()
$stderrOutput = $process.StandardError.ReadToEnd()
$process.WaitForExit()

Set-Location $originalLocation

# Чистим временную папку
Remove-Item $tempRoot -Recurse -Force -ErrorAction SilentlyContinue

if ($process.ExitCode -eq 0) {
    Write-Host "  ✓ Doxygen documentation generated successfully!" -ForegroundColor Green
}
else {
    Write-Host "  ! Doxygen completed with exit code: $($process.ExitCode)" -ForegroundColor Yellow
    if ($stderrOutput) {
        Write-Host "  Warnings: $stderrOutput" -ForegroundColor Gray
    }
    if ($output) {
        Write-Host "  Output: $output" -ForegroundColor Gray
    }
}

Write-Host ""

# Копирование документации backend в общую папку
Write-Host "[2/3] Copying backend API documentation..."
$backendDocsSrc = Join-Path $projectPath "backend\API_DOCS.md"
$backendDocsDst = Join-Path $projectPath "docs\doxygen\html\backend_API_DOCS.md"

if (Test-Path $backendDocsSrc) {
    Copy-Item $backendDocsSrc $backendDocsDst -Force
    Write-Host "  ✓ Backend API documentation copied!" -ForegroundColor Green
}
else {
    Write-Host "  ✗ Backend API documentation not found!" -ForegroundColor Red
}

Write-Host ""

# Открытие документации
Write-Host "[3/3] Opening documentation..."
Start-Process (Join-Path $projectPath "docs\doxygen\html\index.html")
Write-Host "  ✓ Documentation opened in browser!" -ForegroundColor Green

Write-Host ""
Write-Host "========================================"
Write-Host "  Documentation generated!"
Write-Host "========================================"
Write-Host ""
Write-Host "Documentation locations:"
Write-Host "  - Frontend (Doxygen): docs/doxygen/html/index.html"
Write-Host "  - Backend (Markdown): docs/doxygen/html/backend_API_DOCS.md"
Write-Host "  - Backend (Swagger):  http://localhost:8000/docs"
Write-Host ""
Write-Host "Done!"
