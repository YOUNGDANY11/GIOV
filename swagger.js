const roles = {
  1: 'Admin',
  2: 'Director Tecnico',
  3: 'Asistente Tecnico',
  4: 'Entrenador',
  5: 'Medico General',
  6: 'Fisioterapeuta',
  7: 'Quiropractico',
  8: 'Deportista',
  9: 'Usuario Normal'
}

const roleLabel = (ids) => ids.map((id) => `${id}=${roles[id] ?? 'Desconocido'}`).join(', ')

const bearerAuth = [{ bearerAuth: [] }]

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'GIOV Backend API',
    version: '1.0.0',
    description:
      'Documentación Swagger/OpenAPI del backend.\n\n' +
      'Autenticación: JWT Bearer (`Authorization: Bearer <token>`).\n' +
      'Roles (id_role): ' +
      Object.keys(roles)
        .map((k) => `${k}=${roles[k]}`)
        .join(', ') +
      '.'
  },
  servers: [
    {
      url: 'http://localhost:{port}',
      variables: {
        port: { default: '3000' }
      }
    }
  ],
  tags: [
    { name: 'Auth', description: 'Registro e inicio de sesión' },
    { name: 'Users - Admin', description: `Requiere roles: ${roleLabel([1])}` },
    { name: 'Users - Self', description: 'Usuario autenticado (cualquier rol)' },
    { name: 'Roles', description: `Requiere roles: ${roleLabel([1])}` },
    { name: 'Documents - Admin', description: `Requiere roles: ${roleLabel([1, 2, 3])}` },
    { name: 'Documents - Self', description: 'Usuario autenticado (deportista o staff) crea documentos propios' },
    { name: 'Athletes', description: `Admin/Cuerpo técnico: ${roleLabel([1, 2, 3, 4, 5, 6, 7])} | Deportista: ${roleLabel([8])}` },
    { name: 'Staff', description: `Admin/Superiores: ${roleLabel([1, 2, 3])} | Staff operativo: ${roleLabel([4, 5, 6, 7])}` },
    { name: 'Personal Information', description: `Admin/Superiores: ${roleLabel([1, 2, 3])} | Deportista (self): autenticado` },
    { name: 'Relatives', description: `Admin/Cuerpo técnico: ${roleLabel([1, 2, 3, 4, 5, 6, 7])} | Atleta (self): autenticado` },
    { name: 'Categories', description: `Requiere roles: ${roleLabel([1, 2, 3, 4, 5, 6, 7])}` },
    { name: 'Competencies', description: `Requiere roles: ${roleLabel([1, 2, 3, 4, 5, 6, 7])}` },
    { name: 'Athletes In Competencies', description: `Requiere roles: ${roleLabel([1, 2, 3, 4])}` },
    { name: 'Trainings', description: `Requiere roles: ${roleLabel([1, 2, 3, 4])} (GET /api/trainings también permite ${roleLabel([8])})` }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enviar: Authorization: Bearer <token>'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'Error' },
          mensaje: { type: 'string' }
        },
        required: ['status', 'mensaje']
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'Success' },
          mensaje: { type: 'string' }
        },
        required: ['status', 'mensaje']
      },
      Role: {
        type: 'object',
        properties: {
          id_role: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Admin' },
          code: { type: 'string', example: 'ADM' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id_user: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          lastname: { type: 'string' },
          document: { type: 'string', description: 'Número de documento' },
          password: { type: 'string', description: 'Hash en DB (no exponer en frontend)' },
          avatar: { type: 'string', nullable: true },
          id_role: { type: 'integer', description: 'FK roles.id_role' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      UserSafe: {
        allOf: [
          {
            type: 'object',
            properties: {
              id_user: { type: 'integer', format: 'int64' },
              name: { type: 'string' },
              lastname: { type: 'string' },
              avatar: { type: 'string', nullable: true },
              id_role: { type: 'integer' }
            }
          }
        ]
      },
      Athlete: {
        type: 'object',
        properties: {
          id_athlete: { type: 'integer', format: 'int64' },
          id_user: { type: 'integer', format: 'int64' },
          date: { type: 'string', format: 'date', description: 'Fecha de nacimiento' },
          foot: { type: 'string', example: 'Derecho' },
          address: { type: 'string' },
          blood_type: { type: 'string', example: 'O+' },
          stature: { type: 'string', example: '1.75' },
          categorie: { type: 'integer', description: 'FK categories.id_categorie' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          name: { type: 'string', description: 'Nombre del usuario (join)' },
          lastname: { type: 'string', description: 'Apellido del usuario (join)' },
          user_document: { type: 'string', description: 'Documento del usuario (join)' }
        }
      },
      Staff: {
        type: 'object',
        properties: {
          id_staff: { type: 'integer', format: 'int64' },
          id_user: { type: 'integer', format: 'int64' },
          date: { type: 'string', format: 'date' },
          address: { type: 'string' },
          blood_type: { type: 'string' },
          information: { type: 'string' },
          description: { type: 'string' },
          name: { type: 'string', description: 'Nombre del usuario (join)' },
          lastname: { type: 'string', description: 'Apellido del usuario (join)' },
          document: { type: 'string', description: 'Documento del usuario (join)' }
        }
      },
      Document: {
        type: 'object',
        properties: {
          id_document: { type: 'integer', format: 'int64' },
          id_user: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          document: { type: 'string', description: 'Ruta del archivo en uploads/documents' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          user_name: { type: 'string', description: 'Nombre del usuario (join)' },
          user_lastname: { type: 'string', description: 'Apellido del usuario (join)' },
          user_document: { type: 'string', description: 'Documento del usuario (join)' }
        }
      },
      PersonalInformation: {
        type: 'object',
        properties: {
          id_per_inf: { type: 'integer', format: 'int64' },
          id_user: { type: 'integer', format: 'int64' },
          country: { type: 'string' },
          deparment: { type: 'string' },
          city: { type: 'string' },
          email: { type: 'string', format: 'email' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          name: { type: 'string', description: 'Nombre del usuario (join)' },
          lastname: { type: 'string', description: 'Apellido del usuario (join)' },
          document: { type: 'string', description: 'Documento del usuario (join)' }
        }
      },
      Relative: {
        type: 'object',
        properties: {
          id_relative: { type: 'integer', format: 'int64' },
          id_user: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          lastname: { type: 'string' },
          document: { type: 'string' },
          email: { type: 'string', format: 'email' },
          country: { type: 'string' },
          deparment: { type: 'string' },
          city: { type: 'string' },
          type: { type: 'string', description: 'Tipo de parentesco' },
          contact: { type: 'string', description: 'Contacto (teléfono u otro)' },
          created_at: { type: 'string', format: 'date-time' },
          athlete_name: { type: 'string', description: 'Nombre del atleta (join)' },
          athlete_lastname: { type: 'string', description: 'Apellido del atleta (join)' },
          athlete_document: { type: 'string', description: 'Documento del atleta (join)' }
        }
      },
      Category: {
        type: 'object',
        properties: {
          id_categorie: { type: 'integer' },
          name: { type: 'string' },
          minage: { type: 'integer' },
          maxage: { type: 'integer' },
          minAge: { type: 'integer', description: 'Campo real en DB (camelCase)' },
          maxAge: { type: 'integer', description: 'Campo real en DB (camelCase)' },
          description: { type: 'string', nullable: true },
          year: { type: 'string', format: 'date' }
        }
      },
      Competency: {
        type: 'object',
        properties: {
          id_competencie: { type: 'integer', format: 'int64' },
          id_categorie: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string' },
          startdate: { type: 'string', format: 'date' },
          finishdate: { type: 'string', format: 'date', nullable: true },
          startDate: { type: 'string', format: 'date' },
          finishDate: { type: 'string', format: 'date', nullable: true },
          status: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          categorie_id: { type: 'integer' },
          categorie_name: { type: 'string' },
          categorie_minage: { type: 'integer' },
          categorie_maxage: { type: 'integer' },
          categorie_description: { type: 'string', nullable: true },
          categorie_year: { type: 'string', format: 'date' }
        }
      },
      AthleteInCompetency: {
        type: 'object',
        properties: {
          id_ath_comp: { type: 'integer', format: 'int64' },
          id_athlete: { type: 'integer', format: 'int64' },
          id_competencie: { type: 'integer', format: 'int64' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          user_id: { type: 'integer', format: 'int64' },
          athlete_id: { type: 'integer', format: 'int64' },
          athlete_date: { type: 'string', format: 'date' },
          user_document: { type: 'string' },
          user_name: { type: 'string' },
          user_lastname: { type: 'string' },
          competencie_id: { type: 'integer', format: 'int64' },
          competencie_categorie: { type: 'integer' },
          competencie_name: { type: 'string' },
          competencie_description: { type: 'string' },
          competencie_status: { type: 'string' },
          categorie_id: { type: 'integer' },
          categorie_name: { type: 'string' },
          categorie_minage: { type: 'integer' },
          categorie_maxage: { type: 'integer' },
          categorie_description: { type: 'string', nullable: true },
          categorie_year: { type: 'string', format: 'date' }
        }
      },
      TrainingView: {
        type: 'object',
        description: 'Respuesta de consultas (GET) de entrenamientos: no incluye created_at/updated_at y agrega info relacionada.',
        properties: {
          id_training: { type: 'integer', format: 'int64' },
          id_categorie: { type: 'integer' },
          id_staff: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string' },
          date: { type: 'string', format: 'date' },
          time: { type: 'string', description: 'TIME (HH:MM:SS)' },
          location: { type: 'string' },
          staff_name: { type: 'string' },
          staff_lastname: { type: 'string' },
          categorie_name: { type: 'string' }
        }
      },
      TrainingRecord: {
        type: 'object',
        description: 'Registro directo de la tabla trainings (RETURNING *): incluye created_at/updated_at.',
        properties: {
          id_training: { type: 'integer', format: 'int64' },
          id_categorie: { type: 'integer' },
          id_staff: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string' },
          date: { type: 'string', format: 'date' },
          time: { type: 'string', description: 'TIME (HH:MM:SS)' },
          location: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      TrainingUpsert: {
        type: 'object',
        properties: {
          id_categorie: { type: 'integer' },
          id_staff: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string' },
          date: { type: 'string', format: 'date' },
          time: { type: 'string', description: 'TIME (HH:MM:SS)' },
          location: { type: 'string' }
        },
        required: ['id_categorie', 'id_staff', 'name', 'description', 'date', 'time', 'location']
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario (por defecto USER=9)',
        description: 'Crea un usuario. Si no se envía id_role, usa 9 (Usuario Normal).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  lastname: { type: 'string' },
                  document: { type: 'string' },
                  password: { type: 'string' },
                  id_role: { type: 'integer', nullable: true, description: 'Opcional. Si se omite, asigna 9.' }
                },
                required: ['name', 'lastname', 'document', 'password']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Usuario creado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'Success' },
                    mensaje: { type: 'string' },
                    usuario: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          400: { description: 'Validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login (devuelve JWT)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  document: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['document', 'password']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Token JWT',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'Success' },
                    mensaje: { type: 'string' },
                    token: { type: 'string' }
                  },
                  required: ['token']
                }
              }
            }
          },
          400: { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Usuario no existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/users': {
      get: {
        tags: ['Users - Admin'],
        summary: 'Listar usuarios',
        description: `Acceso: ${roleLabel([1])}`,
        security: bearerAuth,
        responses: {
          200: {
            description: 'Lista de usuarios',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    mensaje: { type: 'string' },
                    usuarios: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                  }
                }
              }
            }
          },
          403: { description: 'Token requerido/Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No hay usuarios', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Users - Admin'],
        summary: 'Crear usuario (admin)',
        description: `Acceso: ${roleLabel([1])}. Si no se envía id_role, por defecto usa 8 (Deportista).`,
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  lastname: { type: 'string' },
                  document: { type: 'string' },
                  password: { type: 'string' },
                  id_role: { type: 'integer', nullable: true }
                },
                required: ['name', 'lastname', 'document', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Usuario creado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, usuario: { $ref: '#/components/schemas/User' } } } } } },
          400: { description: 'Validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/users/id/{id}': {
      get: {
        tags: ['Users - Admin'],
        summary: 'Obtener usuario por id_user',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Usuario', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, usuario: { $ref: '#/components/schemas/User' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/users/document': {
      get: {
        tags: ['Users - Admin'],
        summary: 'Buscar usuario por documento (body)',
        description: 'Este endpoint usa GET pero lee `document` desde body (como está implementado).',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { document: { type: 'string' } }, required: ['document'] } } }
        },
        responses: {
          200: { description: 'Usuario', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, usuario: { $ref: '#/components/schemas/User' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/users/name': {
      get: {
        tags: ['Users - Admin'],
        summary: 'Buscar usuarios por nombre (body)',
        description: 'GET leyendo `name` desde body.',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } } }
        },
        responses: {
          200: { description: 'Usuarios', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, usuario: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/users/lastname': {
      get: {
        tags: ['Users - Admin'],
        summary: 'Buscar usuarios por apellido (body)',
        description: 'GET leyendo `lastname` desde body.',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { lastname: { type: 'string' } }, required: ['lastname'] } } }
        },
        responses: {
          200: { description: 'Usuarios', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, usuario: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/users/{id}': {
      put: {
        tags: ['Users - Admin'],
        summary: 'Actualizar usuario (admin)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  lastname: { type: 'string' },
                  document: { type: 'string' },
                  password: { type: 'string' },
                  id_role: { type: 'integer' }
                },
                required: ['name', 'lastname', 'document', 'password', 'id_role']
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, usuario: { $ref: '#/components/schemas/User' } } } } } },
          400: { description: 'Validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Users - Admin'],
        summary: 'Eliminar usuario',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, usuario: { $ref: '#/components/schemas/User' } } } } } },
          400: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/users/active': {
      get: {
        tags: ['Users - Self'],
        summary: 'Obtener perfil del usuario autenticado',
        security: bearerAuth,
        responses: {
          200: { description: 'Usuario (safe)', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, usuario: { $ref: '#/components/schemas/UserSafe' } } } } } },
          403: { description: 'Token requerido/inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/users/active/avatar': {
      put: {
        tags: ['Users - Self'],
        summary: 'Actualizar avatar del usuario autenticado',
        description: 'Subir imagen: campo `image` (multipart/form-data).',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: { type: 'string', format: 'binary' }
                },
                required: ['image']
              }
            }
          }
        },
        responses: {
          200: { description: 'Avatar actualizado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, usuario: { $ref: '#/components/schemas/UserSafe' } } } } } },
          400: { description: 'Debes enviar imagen', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Token requerido/inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/roles': {
      get: {
        tags: ['Roles'],
        summary: 'Listar roles',
        security: bearerAuth,
        responses: {
          200: { description: 'Roles', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, roles: { type: 'array', items: { $ref: '#/components/schemas/Role' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Roles'],
        summary: 'Crear rol',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, code: { type: 'string' } }, required: ['name', 'code'] } } }
        },
        responses: {
          200: { description: 'Rol creado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, rol: { $ref: '#/components/schemas/Role' } } } } } },
          400: { description: 'Validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/roles/id/{id}': {
      get: {
        tags: ['Roles'],
        summary: 'Obtener rol por id_role',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Rol', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, rol: { $ref: '#/components/schemas/Role' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/roles/{id}': {
      delete: {
        tags: ['Roles'],
        summary: 'Eliminar rol',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, rol: { $ref: '#/components/schemas/Role' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/documents': {
      get: {
        tags: ['Documents - Admin'],
        summary: 'Listar documentos',
        security: bearerAuth,
        responses: {
          200: { description: 'Documentos', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, documentos: { type: 'array', items: { $ref: '#/components/schemas/Document' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No hay', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Documents - Self'],
        summary: 'Crear documento (usuario autenticado)',
        description: 'Sube archivo: campo `document` (PDF/Word). El id_user se toma del token.',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  document: { type: 'string', format: 'binary' }
                },
                required: ['name', 'document']
              }
            }
          }
        },
        responses: {
          200: { description: 'Documento creado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, documento: { $ref: '#/components/schemas/Document' } } } } } },
          400: { description: 'Validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Token requerido/inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/documents/id/{id}': {
      get: {
        tags: ['Documents - Admin'],
        summary: 'Obtener documento por id_document',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Documento', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, documento: { $ref: '#/components/schemas/Document' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Documents - Admin'],
        summary: 'Actualizar documento (admin/superiores)',
        description: 'Permite actualizar nombre/description y opcionalmente reemplazar archivo `document` (PDF/Word).',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: false,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  document: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, documento: { $ref: '#/components/schemas/Document' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Documents - Admin'],
        summary: 'Eliminar documento (admin/superiores)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, documento: { $ref: '#/components/schemas/Document' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/documents/document': {
      get: {
        tags: ['Documents - Admin'],
        summary: 'Listar documentos por documento de usuario',
        description: 'Acepta `document` como query (?document=...) o en body.',
        security: bearerAuth,
        parameters: [{ name: 'document', in: 'query', required: false, schema: { type: 'string' } }],
        requestBody: {
          required: false,
          content: { 'application/json': { schema: { type: 'object', properties: { document: { type: 'string' } } } } }
        },
        responses: {
          200: { description: 'Documentos', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, documentos: { type: 'array', items: { $ref: '#/components/schemas/Document' } } } } } } },
          400: { description: 'Falta document', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Sin documentos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletes': {
      get: {
        tags: ['Athletes'],
        summary: 'Listar atletas',
        description: `Acceso: ${roleLabel([1, 2, 3, 4, 5, 6, 7])}`,
        security: bearerAuth,
        responses: {
          200: { description: 'Atletas', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, deportistas: { type: 'array', items: { $ref: '#/components/schemas/Athlete' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No hay', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletes/id/{id}': {
      get: {
        tags: ['Athletes'],
        summary: 'Obtener atleta por id_athlete',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Atleta', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, atleta: { $ref: '#/components/schemas/Athlete' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Athletes'],
        summary: 'Actualizar atleta por id_athlete (admin/cuerpo técnico)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date' },
                  foot: { type: 'string' },
                  address: { type: 'string' },
                  blood_type: { type: 'string' },
                  stature: { type: 'string' }
                },
                required: ['date', 'foot', 'address', 'blood_type', 'stature']
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, deportista: { $ref: '#/components/schemas/Athlete' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletes/document': {
      get: {
        tags: ['Athletes'],
        summary: 'Buscar atleta por documento de usuario (body)',
        description: 'GET leyendo `document` desde body.',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { document: { type: 'string' } }, required: ['document'] } } }
        },
        responses: {
          200: { description: 'Atleta', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, atleta: { $ref: '#/components/schemas/Athlete' } } } } } },
          400: { description: 'Falta document', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No hay atleta', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletes/date': {
      get: {
        tags: ['Athletes'],
        summary: 'Listar atletas por año de nacimiento (body.year)',
        description: 'GET leyendo `year` desde body.',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { year: { type: 'integer', example: 2010 } }, required: ['year'] } } }
        },
        responses: {
          200: { description: 'Atletas', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, deportistas: { type: 'array', items: { $ref: '#/components/schemas/Athlete' } } } } } } },
          400: { description: 'Validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No hay', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletes/stature': {
      get: {
        tags: ['Athletes'],
        summary: 'Buscar atletas por estatura (body.stature)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { stature: { type: 'string' } }, required: ['stature'] } } } },
        responses: {
          200: { description: 'Atletas', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, deportistas: { type: 'array', items: { $ref: '#/components/schemas/Athlete' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletes/foot': {
      get: {
        tags: ['Athletes'],
        summary: 'Buscar atletas por pie dominante (body.foot)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { foot: { type: 'string' } }, required: ['foot'] } } } },
        responses: {
          200: { description: 'Atletas', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, deportistas: { type: 'array', items: { $ref: '#/components/schemas/Athlete' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletes/active': {
      get: {
        tags: ['Athletes'],
        summary: 'Obtener atleta del usuario autenticado (solo Deportista)',
        description: `Acceso: ${roleLabel([8])}. Consulta por id_user del token.`,
        security: bearerAuth,
        responses: {
          200: { description: 'Atleta', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, deportista: { $ref: '#/components/schemas/Athlete' } } } } } },
          404: { description: 'No existe atleta para el usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Athletes'],
        summary: 'Crear atleta desde usuario autenticado (solo Deportista)',
        description: `Acceso: ${roleLabel([8])}. id_user se toma del token.`,
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date' },
                  foot: { type: 'string' },
                  address: { type: 'string' },
                  blood_type: { type: 'string' },
                  stature: { type: 'string' }
                },
                required: ['date', 'foot', 'address', 'blood_type', 'stature']
              }
            }
          }
        },
        responses: {
          200: { description: 'Creado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, deportista: { $ref: '#/components/schemas/Athlete' } } } } } },
          400: { description: 'Ya registrado / validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletes/': {
      put: {
        tags: ['Athletes'],
        summary: 'Actualizar atleta del usuario autenticado (solo Deportista)',
        description: `Acceso: ${roleLabel([8])}. Actualiza por id_user del token.`,
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  address: { type: 'string' },
                  stature: { type: 'string' },
                  foot: { type: 'string' }
                },
                required: ['address', 'stature', 'foot']
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizado', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, deportista: { $ref: '#/components/schemas/Athlete' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/staff': {
      get: {
        tags: ['Staff'],
        summary: 'Listar staff (admin/superiores)',
        description: `Acceso: ${roleLabel([1, 2, 3])}`,
        security: bearerAuth,
        responses: {
          200: { description: 'Staff', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, mensaje: { type: 'string' }, staff: { type: 'array', items: { $ref: '#/components/schemas/Staff' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/staff/id/{id}': {
      get: {
        tags: ['Staff'],
        summary: 'Obtener staff por id_staff (admin/superiores)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Staff', content: { 'application/json': { schema: { type: 'object', properties: { staff: { $ref: '#/components/schemas/Staff' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Staff'],
        summary: 'Actualizar staff por id_staff (admin/superiores)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date' },
                  address: { type: 'string' },
                  blood_type: { type: 'string' },
                  information: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['date', 'address', 'blood_type', 'information', 'description']
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizado', content: { 'application/json': { schema: { type: 'object', properties: { staff: { $ref: '#/components/schemas/Staff' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Staff'],
        summary: 'Eliminar staff por id_staff (admin/superiores)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado', content: { 'application/json': { schema: { type: 'object', properties: { staff: { $ref: '#/components/schemas/Staff' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/staff/document': {
      get: {
        tags: ['Staff'],
        summary: 'Buscar staff por documento de usuario (body.document) (admin/superiores)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { document: { type: 'string' } }, required: ['document'] } } } },
        responses: {
          200: { description: 'Staff', content: { 'application/json': { schema: { type: 'object', properties: { staff: { $ref: '#/components/schemas/Staff' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/staff/active': {
      get: {
        tags: ['Staff'],
        summary: 'Obtener staff del usuario autenticado (roles 4-7)',
        description: `Acceso: ${roleLabel([4, 5, 6, 7])}.`,
        security: bearerAuth,
        responses: {
          200: { description: 'Staff', content: { 'application/json': { schema: { type: 'object', properties: { staff: { $ref: '#/components/schemas/Staff' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Staff'],
        summary: 'Crear staff del usuario autenticado (roles 4-7)',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date' },
                  address: { type: 'string' },
                  blood_type: { type: 'string' },
                  information: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['date', 'address', 'blood_type', 'information', 'description']
              }
            }
          }
        },
        responses: {
          200: { description: 'Creado', content: { 'application/json': { schema: { type: 'object', properties: { staff: { $ref: '#/components/schemas/Staff' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Staff'],
        summary: 'Actualizar staff del usuario autenticado (roles 4-7)',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date' },
                  address: { type: 'string' },
                  blood_type: { type: 'string' },
                  information: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['date', 'address', 'blood_type', 'information', 'description']
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizado', content: { 'application/json': { schema: { type: 'object', properties: { staff: { $ref: '#/components/schemas/Staff' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/personalInf': {
      get: {
        tags: ['Personal Information'],
        summary: 'Listar información personal (admin/superiores)',
        security: bearerAuth,
        responses: {
          200: { description: 'Info personal', content: { 'application/json': { schema: { type: 'object', properties: { informacion_personal: { type: 'array', items: { $ref: '#/components/schemas/PersonalInformation' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Personal Information'],
        summary: 'Crear información personal (usuario autenticado)',
        description: 'No tiene roleMiddleware en rutas; requiere estar autenticado. id_user sale del token.',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  country: { type: 'string' },
                  deparment: { type: 'string' },
                  city: { type: 'string' },
                  email: { type: 'string', format: 'email' }
                },
                required: ['country', 'deparment', 'city', 'email']
              }
            }
          }
        },
        responses: {
          200: { description: 'Creado', content: { 'application/json': { schema: { type: 'object', properties: { informacion_personal: { $ref: '#/components/schemas/PersonalInformation' } } } } } },
          403: { description: 'Token requerido/inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/personalInf/id/{id}': {
      get: {
        tags: ['Personal Information'],
        summary: 'Obtener información personal por id_per_inf (admin/superiores)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Info personal', content: { 'application/json': { schema: { type: 'object', properties: { informacion_personal: { $ref: '#/components/schemas/PersonalInformation' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Personal Information'],
        summary: 'Actualizar información personal por id_per_inf (admin/superiores)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  country: { type: 'string' },
                  deparment: { type: 'string' },
                  city: { type: 'string' },
                  email: { type: 'string', format: 'email' }
                },
                required: ['country', 'deparment', 'city', 'email']
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizado', content: { 'application/json': { schema: { type: 'object', properties: { informacion_personal: { $ref: '#/components/schemas/PersonalInformation' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Personal Information'],
        summary: 'Eliminar información personal por id_per_inf (admin/superiores)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado', content: { 'application/json': { schema: { type: 'object', properties: { informacion_personal: { $ref: '#/components/schemas/PersonalInformation' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/personalInf/document': {
      get: {
        tags: ['Personal Information'],
        summary: 'Buscar info personal por documento (body.document) (admin/superiores)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { document: { type: 'string' } }, required: ['document'] } } } },
        responses: {
          200: { description: 'Info personal', content: { 'application/json': { schema: { type: 'object', properties: { informacion_personal: { $ref: '#/components/schemas/PersonalInformation' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/personalInf/active': {
      get: {
        tags: ['Personal Information'],
        summary: 'Obtener info personal del usuario autenticado',
        security: bearerAuth,
        responses: {
          200: { description: 'Info personal', content: { 'application/json': { schema: { type: 'object', properties: { informacion_personal: { $ref: '#/components/schemas/PersonalInformation' } } } } } },
          403: { description: 'Token requerido/inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/relatives': {
      get: {
        tags: ['Relatives'],
        summary: 'Listar parientes (admin/cuerpo técnico)',
        security: bearerAuth,
        responses: {
          200: { description: 'Parientes', content: { 'application/json': { schema: { type: 'object', properties: { parientes: { type: 'array', items: { $ref: '#/components/schemas/Relative' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Relatives'],
        summary: 'Crear pariente (admin/cuerpo técnico)',
        description: 'Crea pariente para un atleta especificando id_user del atleta.',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_user: { type: 'integer', format: 'int64' },
                  name: { type: 'string' },
                  lastname: { type: 'string' },
                  document: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  country: { type: 'string' },
                  deparment: { type: 'string' },
                  city: { type: 'string' },
                  type: { type: 'string' },
                  contact: { type: 'string' }
                },
                required: ['id_user', 'name', 'lastname', 'document', 'email', 'country', 'deparment', 'city', 'type', 'contact']
              }
            }
          }
        },
        responses: {
          200: { description: 'Pariente creado', content: { 'application/json': { schema: { type: 'object', properties: { pariente: { $ref: '#/components/schemas/Relative' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/relatives/id/{id}': {
      get: {
        tags: ['Relatives'],
        summary: 'Obtener pariente por id_relative (admin/cuerpo técnico)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Pariente', content: { 'application/json': { schema: { type: 'object', properties: { pariente: { $ref: '#/components/schemas/Relative' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Relatives'],
        summary: 'Actualizar pariente por id_relative (admin/cuerpo técnico)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  lastname: { type: 'string' },
                  document: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  country: { type: 'string' },
                  deparment: { type: 'string' },
                  city: { type: 'string' },
                  type: { type: 'string' },
                  contact: { type: 'string' }
                },
                required: ['name', 'lastname', 'document', 'email', 'country', 'deparment', 'city', 'type', 'contact']
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizado', content: { 'application/json': { schema: { type: 'object', properties: { pariente: { $ref: '#/components/schemas/Relative' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Relatives'],
        summary: 'Eliminar pariente por id_relative (admin/cuerpo técnico)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado', content: { 'application/json': { schema: { type: 'object', properties: { pariente: { $ref: '#/components/schemas/Relative' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/relatives/athlete/document': {
      get: {
        tags: ['Relatives'],
        summary: 'Listar parientes por documento del atleta (body.document)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { document: { type: 'string' } }, required: ['document'] } } } },
        responses: {
          200: { description: 'Parientes', content: { 'application/json': { schema: { type: 'object', properties: { pariente: { type: 'array', items: { $ref: '#/components/schemas/Relative' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/relatives/document': {
      get: {
        tags: ['Relatives'],
        summary: 'Buscar pariente por documento (body.document)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { document: { type: 'string' } }, required: ['document'] } } } },
        responses: {
          200: { description: 'Pariente', content: { 'application/json': { schema: { type: 'object', properties: { pariente: { $ref: '#/components/schemas/Relative' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/relatives/name': {
      get: {
        tags: ['Relatives'],
        summary: 'Buscar parientes por nombre (body.name)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } } } },
        responses: {
          200: { description: 'Parientes', content: { 'application/json': { schema: { type: 'object', properties: { pariente: { type: 'array', items: { $ref: '#/components/schemas/Relative' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/relatives/lastname': {
      get: {
        tags: ['Relatives'],
        summary: 'Buscar parientes por apellido (body.lastname)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { lastname: { type: 'string' } }, required: ['lastname'] } } } },
        responses: {
          200: { description: 'Parientes', content: { 'application/json': { schema: { type: 'object', properties: { pariente: { type: 'array', items: { $ref: '#/components/schemas/Relative' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/relatives/active': {
      get: {
        tags: ['Relatives'],
        summary: 'Listar parientes del atleta autenticado',
        description: 'No tiene roleMiddleware en rutas; requiere autenticación. (Pensado para atletas).',
        security: bearerAuth,
        responses: {
          200: { description: 'Parientes', content: { 'application/json': { schema: { type: 'object', properties: { parientes: { type: 'array', items: { $ref: '#/components/schemas/Relative' } } } } } } },
          403: { description: 'Token requerido/inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Relatives'],
        summary: 'Crear pariente desde atleta autenticado',
        description: 'id_user se toma del token.',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  lastname: { type: 'string' },
                  document: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  country: { type: 'string' },
                  deparment: { type: 'string' },
                  city: { type: 'string' },
                  type: { type: 'string' },
                  contact: { type: 'string' }
                },
                required: ['name', 'lastname', 'document', 'email', 'country', 'deparment', 'city', 'type', 'contact']
              }
            }
          }
        },
        responses: {
          200: { description: 'Pariente creado', content: { 'application/json': { schema: { type: 'object', properties: { pariente: { $ref: '#/components/schemas/Relative' } } } } } },
          403: { description: 'Token requerido/inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Listar categorías',
        security: bearerAuth,
        responses: {
          200: { description: 'Categorías', content: { 'application/json': { schema: { type: 'object', properties: { categorias: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Categories'],
        summary: 'Crear categoría',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  minAge: { type: 'integer' },
                  maxAge: { type: 'integer' },
                  description: { type: 'string' },
                  year: { type: 'integer', example: 2026, description: 'Se convierte a YYYY-01-01' }
                },
                required: ['name', 'minAge', 'maxAge', 'description', 'year']
              }
            }
          }
        },
        responses: {
          200: { description: 'Creada', content: { 'application/json': { schema: { type: 'object', properties: { categoria: { $ref: '#/components/schemas/Category' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/categories/id/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Obtener categoría por id_categorie',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Categoría', content: { 'application/json': { schema: { type: 'object', properties: { categoria: { $ref: '#/components/schemas/Category' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Categories'],
        summary: 'Actualizar categoría por id_categorie',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  minAge: { type: 'integer' },
                  maxAge: { type: 'integer' },
                  description: { type: 'string' },
                  year: { type: 'integer', example: 2026 }
                },
                required: ['name', 'minAge', 'maxAge', 'description', 'year']
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizada', content: { 'application/json': { schema: { type: 'object', properties: { categoria: { $ref: '#/components/schemas/Category' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Categories'],
        summary: 'Eliminar categoría por id_categorie',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminada', content: { 'application/json': { schema: { type: 'object', properties: { categoria: { $ref: '#/components/schemas/Category' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/categories/year': {
      get: {
        tags: ['Categories'],
        summary: 'Listar categorías por año (body.year)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { year: { type: 'integer', example: 2026 } }, required: ['year'] } } } },
        responses: {
          200: { description: 'Categorías', content: { 'application/json': { schema: { type: 'object', properties: { categorias: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/competencies': {
      get: {
        tags: ['Competencies'],
        summary: 'Listar competencias',
        security: bearerAuth,
        responses: {
          200: { description: 'Competencias', content: { 'application/json': { schema: { type: 'object', properties: { competencias: { type: 'array', items: { $ref: '#/components/schemas/Competency' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Competencies'],
        summary: 'Crear competencia',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_categorie: { type: 'integer' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  startDate: { type: 'string', format: 'date' },
                  finishDate: { type: 'string', format: 'date' },
                  status: { type: 'string' }
                },
                required: ['id_categorie', 'name', 'description', 'startDate', 'finishDate', 'status']
              }
            }
          }
        },
        responses: {
          200: { description: 'Creada', content: { 'application/json': { schema: { type: 'object', properties: { competencia: { $ref: '#/components/schemas/Competency' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/competencies/id/{id}': {
      get: {
        tags: ['Competencies'],
        summary: 'Obtener competencia por id_competencie',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Competencia', content: { 'application/json': { schema: { type: 'object', properties: { competencia: { $ref: '#/components/schemas/Competency' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Competencies'],
        summary: 'Actualizar competencia por id_competencie',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_categorie: { type: 'integer' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  startDate: { type: 'string', format: 'date' },
                  finishDate: { type: 'string', format: 'date' },
                  status: { type: 'string' }
                },
                required: ['id_categorie', 'name', 'description', 'startDate', 'finishDate', 'status']
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizada', content: { 'application/json': { schema: { type: 'object', properties: { competencia: { $ref: '#/components/schemas/Competency' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Competencies'],
        summary: 'Eliminar competencia por id_competencie',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminada', content: { 'application/json': { schema: { type: 'object', properties: { competencia: { $ref: '#/components/schemas/Competency' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/competencies/categorie': {
      get: {
        tags: ['Competencies'],
        summary: 'Listar competencias por nombre de categoría (body.categorieName)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { categorieName: { type: 'string' } }, required: ['categorieName'] } } } },
        responses: {
          200: { description: 'Competencias', content: { 'application/json': { schema: { type: 'object', properties: { competencias: { type: 'array', items: { $ref: '#/components/schemas/Competency' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/competencies/name': {
      get: {
        tags: ['Competencies'],
        summary: 'Listar competencias por nombre (body.name)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } } } },
        responses: {
          200: { description: 'Competencias', content: { 'application/json': { schema: { type: 'object', properties: { competencias: { type: 'array', items: { $ref: '#/components/schemas/Competency' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/competencies/status': {
      get: {
        tags: ['Competencies'],
        summary: 'Listar competencias por status (body.status)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' } }, required: ['status'] } } } },
        responses: {
          200: { description: 'Competencias', content: { 'application/json': { schema: { type: 'object', properties: { competencias: { type: 'array', items: { $ref: '#/components/schemas/Competency' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/trainings': {
      get: {
        tags: ['Trainings'],
        summary: 'Listar entrenamientos',
        description: `Acceso: ${roleLabel([1, 2, 3, 4])} (también ${roleLabel([8])})`,
        security: bearerAuth,
        responses: {
          200: {
            description: 'Lista de entrenamientos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    mensaje: { type: 'string' },
                    entrenamientos: { type: 'array', items: { $ref: '#/components/schemas/TrainingView' } }
                  }
                }
              }
            }
          },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No hay entrenamientos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Trainings'],
        summary: 'Crear entrenamiento',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainingUpsert' } } }
        },
        responses: {
          200: {
            description: 'Entrenamiento creado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    mensaje: { type: 'string' },
                    entrenamiento: { $ref: '#/components/schemas/TrainingRecord' }
                  }
                }
              }
            }
          },
          400: { description: 'Validación / duplicado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/trainings/id/{id}': {
      get: {
        tags: ['Trainings'],
        summary: 'Obtener entrenamiento por id_training',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: {
            description: 'Entrenamiento',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    mensaje: { type: 'string' },
                    entrenamiento: { $ref: '#/components/schemas/TrainingView' }
                  }
                }
              }
            }
          },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Trainings'],
        summary: 'Actualizar entrenamiento por id_training',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainingUpsert' } } } },
        responses: {
          200: {
            description: 'Actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    mensaje: { type: 'string' },
                    entrenamiento: { $ref: '#/components/schemas/TrainingRecord' }
                  }
                }
              }
            }
          },
          400: { description: 'Validación / duplicado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Trainings'],
        summary: 'Eliminar entrenamiento por id_training',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: {
            description: 'Eliminado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    mensaje: { type: 'string' },
                    entrenamiento: { $ref: '#/components/schemas/TrainingRecord' }
                  }
                }
              }
            }
          },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/trainings/staff/{id}': {
      get: {
        tags: ['Trainings'],
        summary: 'Listar entrenamientos por id_staff',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: {
            description: 'Entrenamientos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    mensaje: { type: 'string' },
                    entrenamientos: { type: 'array', items: { $ref: '#/components/schemas/TrainingView' } }
                  }
                }
              }
            }
          },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No hay entrenamientos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/trainings/location': {
      get: {
        tags: ['Trainings'],
        summary: 'Listar entrenamientos por ubicación (body.location)',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { location: { type: 'string' } }, required: ['location'] } } }
        },
        responses: {
          200: {
            description: 'Entrenamientos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    mensaje: { type: 'string' },
                    entrenamientos: { type: 'array', items: { $ref: '#/components/schemas/TrainingView' } }
                  }
                }
              }
            }
          },
          400: { description: 'Validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No hay entrenamientos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletesInCompetencies': {
      get: {
        tags: ['Athletes In Competencies'],
        summary: 'Listar atletas en competencias',
        security: bearerAuth,
        responses: {
          200: { description: 'Registros', content: { 'application/json': { schema: { type: 'object', properties: { atletas: { type: 'array', items: { $ref: '#/components/schemas/AthleteInCompetency' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Athletes In Competencies'],
        summary: 'Asignar atleta a competencia',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { id_athlete: { type: 'integer' }, id_competencie: { type: 'integer' } }, required: ['id_athlete', 'id_competencie'] } } }
        },
        responses: {
          200: { description: 'Asignado', content: { 'application/json': { schema: { type: 'object' } } } },
          400: { description: 'Ya asociado / validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletesInCompetencies/id/{id}': {
      get: {
        tags: ['Athletes In Competencies'],
        summary: 'Obtener asignación por id_ath_comp',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Registro', content: { 'application/json': { schema: { type: 'object', properties: { atleta: { $ref: '#/components/schemas/AthleteInCompetency' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Athletes In Competencies'],
        summary: 'Actualizar asignación por id_ath_comp',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { id_athlete: { type: 'integer' }, id_competencie: { type: 'integer' } }, required: ['id_athlete', 'id_competencie'] } } }
        },
        responses: {
          200: { description: 'Actualizado', content: { 'application/json': { schema: { type: 'object', properties: { atleta: { $ref: '#/components/schemas/AthleteInCompetency' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Athletes In Competencies'],
        summary: 'Eliminar asignación por id_ath_comp',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado', content: { 'application/json': { schema: { type: 'object', properties: { atleta: { $ref: '#/components/schemas/AthleteInCompetency' } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    '/api/athletesInCompetencies/document': {
      get: {
        tags: ['Athletes In Competencies'],
        summary: 'Listar asignaciones por documento del atleta (body.document)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { document: { type: 'string' } }, required: ['document'] } } } },
        responses: {
          200: { description: 'Registros', content: { 'application/json': { schema: { type: 'object', properties: { atleta: { type: 'array', items: { $ref: '#/components/schemas/AthleteInCompetency' } } } } } } },
          403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    }
  }
}
