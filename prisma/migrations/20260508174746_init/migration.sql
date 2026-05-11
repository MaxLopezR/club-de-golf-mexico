-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Anuncio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'borrador',
    "fechaPublicacion" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "hora" TEXT,
    "lugar" TEXT,
    "descripcion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "InfoNosotros" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mision" TEXT NOT NULL,
    "historia" TEXT NOT NULL,
    "directiva" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EstadoCuenta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cuotaMensual" REAL NOT NULL,
    "banco" TEXT NOT NULL,
    "clabe" TEXT NOT NULL,
    "referencia" TEXT NOT NULL,
    "vencimientoDia" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PagoHistorial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mes" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "estado" TEXT NOT NULL,
    "estadoCuentaId" TEXT NOT NULL,
    CONSTRAINT "PagoHistorial_estadoCuentaId_fkey" FOREIGN KEY ("estadoCuentaId") REFERENCES "EstadoCuenta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Encuesta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pregunta" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Opcion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "texto" TEXT NOT NULL,
    "encuestaId" TEXT NOT NULL,
    CONSTRAINT "Opcion_encuestaId_fkey" FOREIGN KEY ("encuestaId") REFERENCES "Encuesta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Voto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "encuestaId" TEXT NOT NULL,
    "opcionId" TEXT NOT NULL,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Voto_encuestaId_fkey" FOREIGN KEY ("encuestaId") REFERENCES "Encuesta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Voto_opcionId_fkey" FOREIGN KEY ("opcionId") REFERENCES "Opcion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Colono" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nombre" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Colono_email_key" ON "Colono"("email");
