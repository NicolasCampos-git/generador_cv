<script setup>
import { ref, onMounted } from 'vue';
import {z} from 'zod'
import { DataTable,Button, Column, InputText, Dialog, Message } from 'primevue';

const listadoPostulantes = ref([])

const isLoadingTable = ref(true)

const formularioVisible = ref(false)

// Datos formulario.
const nombreCompleto = ref('')
const email = ref('')
const telefono = ref('')
const georeferencia = ref('')
const fechaNacimiento = ref('')

const serverError = ref('')

const registrarPostulanteSchema = z.object({
    nombreCompleto: z
        .string()
        .min(1, 'El nombre no puede estar vacío')
        .max(256, 'El nombre no puede exceder los 256 caracteres')
        .regex(/^[^0-9]*$/, 'El nombre no debe contener números'),

    email: z
        .email('Formato de email inválido')
        .min(1, 'El email no puede estar vacío')
        .max(256, 'El email no puede exceder los 256 caracteres'),


    telefono: z
        .string()
        .regex(/^[\d\s\-+]+$/, 'El teléfono solo debe contener números, espacios, guiones y el símbolo +')
        .min(6, 'El teléfono debe tener al menos 6 caracteres')
        .max(24, 'El teléfono no puede exceder los 24 caracteres'),

    georeferencia: z
        .string()
        .min(2, 'La georeferencia debe tener al menos 2 caracteres')
        .max(128, 'La georeferencia no puede exceder los 128 caracteres'),

    fechaNacimiento: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD')
});

const erroresEnCampos = ref({
  nombreCompleto: '',
  email: '',
  telefono: '',
  georeferencia: '',
  fechaNacimiento: ''
})

const validarFormularioRegistroPostulante = () =>{

  erroresEnCampos.value = {
    nombreCompleto: '',
    email: '',
    telefono: '',
    georeferencia: '',
    fechaNacimiento: ''
  }
  const resultado = registrarPostulanteSchema.safeParse({
    nombreCompleto: nombreCompleto.value,
    email: email.value,
    telefono: telefono.value,
    georeferencia: georeferencia.value,
    fechaNacimiento: fechaNacimiento.value
  })

  if (resultado.success ){
    return true
  }

  for (const issue of resultado.error.issues) {
      const campo = issue.path[0]
      if (campo in erroresEnCampos.value) {
        erroresEnCampos.value[campo] = issue.message
      }
    }

  return false

}

const registrarPostulante = async () => {
  serverError.value = ''

  if( !validarFormularioRegistroPostulante()){
    return
  }

  try {
    const respuesta = await fetch('http://localhost:3000/api/curriculums/postulantes/registrar',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombreCompleto: nombreCompleto.value,
        email: email.value,
        telefono: telefono.value,
        georeferencia: georeferencia.value,
        fechaNacimiento: fechaNacimiento.value
      })
    })

    const data = await respuesta.json()

    if ( !data || data?.success === false){
      throw new Error(data.message || 'Error al registrar postulante.')
    }

    listadoPostulantes.value.push(data.data)


    formularioVisible.value = false
  } catch (error) {
    serverError.value = error.message || 'Error al registrar postulante.'

  }
}


const handleTable = async() => {
  serverError.value = ''
  isLoadingTable.value = true

  try {
    const response = await fetch('http://localhost:3000/api/curriculums/postulantes/listar');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    listadoPostulantes.value = data.data ?? data;
    isLoadingTable.value = false;

  } catch (error) {
    serverError.value = 'Error al cargar postulantes'

  }finally{
    isLoadingTable.value =false
  }

}

const agregarPostulante = async () => {
  formularioVisible.value = true



}

onMounted(() => {
  handleTable();
});
</script>

<template>
  <div class="postulantes-container">
    <DataTable :loading="isLoadingTable" :value="listadoPostulantes" class="tabla-postulantes">
      <template #header>
        <div class="tabla-header">
          <span class="tabla-titulo">Postulantes</span>
          <div class="tabla-acciones">
            <Button label="Update" icon="pi pi-refresh" iconPos="bottom" @click="handleTable" class="btn-actualizar" />
            <Button label="Agregar" @click="agregarPostulante" class="btn-agregar"/>
          </div>
        </div>
        <Dialog v-model:visible="formularioVisible" modal header="Agregar postulante" class="dialog-postulante" :closable="true" :dismissableMask="true" :closeOnEscape="true">
            <form @submit.prevent="registrarPostulante">
              <div class="formulario-postulante">
                <div class="campo-formulario">
                  <label>Nombre Completo</label>
                  <InputText v-model="nombreCompleto" placeholder="Ej: Juan Lopez"/>
                  <Message severity="error" variant="simple" v-if="erroresEnCampos.nombreCompleto">{{ erroresEnCampos.nombreCompleto }}</Message>
                </div>
                <div class="campo-formulario">
                  <label>Email</label>
                  <InputText v-model="email" placeholder="Ej: juan.lopez@email.com"/>
                  <Message severity="error" variant="simple" v-if="erroresEnCampos.email">{{ erroresEnCampos.email }}</Message>
                </div>
                <div class="campo-formulario">
                  <label>Teléfono</label>
                  <InputText v-model="telefono" placeholder="Ej: +54 9 353 1234567"/>
                  <Message severity="error" variant="simple" v-if="erroresEnCampos.telefono">{{ erroresEnCampos.telefono }}</Message>
                </div>
                <div class="campo-formulario">
                  <label>Localidad</label>
                  <InputText v-model="georeferencia" placeholder="Ej: Villa Maria, Córdoba, Argentina"/>
                  <Message severity="error" variant="simple" v-if="erroresEnCampos.georeferencia">{{ erroresEnCampos.georeferencia }}</Message>
                </div>
                <div class="campo-formulario">
                  <label>Fecha de Nacimiento</label>
                  <InputText v-model="fechaNacimiento" type="date" placeholder="YYYY-MM-DD"/>
                  <Message severity="error" variant="simple" v-if="erroresEnCampos.fechaNacimiento">{{ erroresEnCampos.fechaNacimiento }}</Message>
                </div>
                <div>
                  <Message  v-if="serverError" severity="error" variant="simple" icon="pi pi-times-circle">
                      {{ serverError }}
                  </Message>
                  <Button label="Guardar" severity="success" type="submit" rounded />
                </div>
            </div>
          </form>
        </Dialog>
      </template>
      <Column field="nombreCompleto" header="Nombre"/>
      <Column field="email" header="Email"/>
      <Column field="telefono" header="Telefono"/>
      <Column field="fechaNacimiento" header="Fecha de nacimiento" />
      <Column field="georeferencia" header="Localidad"/>
      <Column header="Acciones" :exportable="false" style="width: 14rem">
        <template #body="{ data }">
          <div class="acciones-fila">
            <Button icon="pi pi-eye" severity="info" text rounded />
            <Button icon="pi pi-pencil" severity="warning" text rounded />
            <Button icon="pi pi-trash" severity="danger" text rounded/>
          </div>
        </template>
      </Column>
    </DataTable>
    <p v-if="serverError" class="error-mensaje">{{ serverError }}</p>
  </div>
</template>

<style scoped>
.postulantes-container {
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.tabla-postulantes {@c
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.tabla-titulo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.tabla-acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-actualizar {
  background-color: #6366f1;
  border-color: #6366f1;
}

.btn-agregar {
  background-color: #10b981;
  border-color: #10b981;
}

.btn-acciones {
  background-color: #64748b;
  border-color: #64748b;
}

.formulario-postulante {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
  min-width: 400px;
}

.campo-formulario {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.campo-formulario label {
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
}

.campo-formulario input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
}

.campo-formulario input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.error-mensaje {
  color: #ef4444;
  background-color: #fee2e2;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  border-left: 4px solid #ef4444;
}
</style>
