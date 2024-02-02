const express = require("express");
const { estController } = require("../controllers/estController");

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Estudiantes
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Estudiante:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *         nombre:
 *           type: string
 *         apellido_pat:
 *           type: string
 *         apellido_mat:
 *           type: string
 *         telefono:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           writeOnly: true
 *         isDelegado:
 *           type: boolean
 *         nota_ec:
 *           type: number
 *         nota_ep:
 *           type: number
 *         nota_ef:
 *           type: number
 *         promedio:
 *           type: number
 */

/**
 * @openapi
 * /estudiantes:
 *   get:
 *     summary: Obtener la lista de todos los estudiantes
 *     tags:
 *       - Estudiantes
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Estudiante'
 */
router.get("/", estController.getAll);

/**
 * @openapi
 * /estudiantes/{email}:
 *   get:
 *     summary: Obtener información de un estudiante por email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del estudiante.
 *         schema:
 *           type: string
 *     tags:
 *       - Estudiantes
 *     responses:
 *       200:
 *         description: Información del estudiante obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 */
router.get("/:email", estController.getEstudiante);

/**
 * @openapi
 * /estudiantes/cod/{codigo}:
 *   get:
 *     summary: Obtener información de un estudiante por código
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         description: Código del estudiante.
 *         schema:
 *           type: string
 *     tags:
 *       - Estudiantes
 *     responses:
 *       200:
 *         description: Información del estudiante obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 */
router.get("/cod/:codigo", estController.getEstudianteCod);

/**
 * @openapi
 * /estudiantes:
 *   post:
 *     summary: Registrar un nuevo estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido_pat:
 *                 type: string
 *               apellido_mat:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isDelegado:
 *                  type: boolean
 *     tags:
 *       - Estudiantes
 *     responses:
 *       201:
 *         description: Estudiante registrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Estudiante registrado correctamente
 */
router.post("/", estController.createEstudiante);

/**
 * @openapi
 * /estudiantes/notas/{email}:
 *   post:
 *     summary: Ingresar notas de un estudiante
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del estudiante.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nota_ec:
 *                 type: number
 *               nota_ep:
 *                 type: number
 *               nota_ef:
 *                 type: number
 *     tags:
 *       - Estudiantes
 *     responses:
 *       200:
 *         description: Notas ingresadas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Notas ingresadas correctamente
 */
router.post("/notas/:email", estController.updateNotas);

/**
 * @openapi
 * /estudiantes/{email}:
 *   put:
 *     summary: Modificar datos de un estudiante
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Correo electrónico del estudiante.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido_pat:
 *                 type: string
 *               apellido_mat:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isDelegado:
 *                  type: boolean
 *     tags:
 *       - Estudiantes
 *     responses:
 *       200:
 *         description: Datos modificados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Datos modificados correctamente
 */
router.put("/:email", estController.updateEstudiante);

/**
 * @openapi
 * /estudiantes/modTelefono:
 *   patch:
 *     summary: Modificar teléfono de un estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nuevoTelefono:
 *                 type: string
 *     tags:
 *       - Estudiantes
 *     responses:
 *       200:
 *         description: Teléfono modificado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Teléfono modificado correctamente
 */
router.patch("/modTelefono", estController.updateTelefono);

/**
 * @openapi
 * /estudiantes/{email}:
 *   delete:
 *     summary: Eliminar registro de un estudiante
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del estudiante.
 *         schema:
 *           type: string
 *     tags:
 *       - Estudiantes
 *     responses:
 *       200:
 *         description: Información del estudiante eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Estudiante eliminado correctamente
 */
router.delete("/:email", estController.deleteEstudiante);

/**
 * @openapi
 * /estudiantes/login:
 *   post:
 *     summary: Iniciar sesión como estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     tags:
 *       - Estudiantes
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */

router.post("/login", estController.login);

module.exports = router;
