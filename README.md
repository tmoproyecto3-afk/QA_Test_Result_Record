# QA Test Result Record - Azure Project

## 📋 Introduccion:

Proyecto “QA Test Result Record”, iniciativa orientada a optimizar el proceso de actualización de resultados de pruebas UAT en plataforma Azure Devops.
 
## 🎯 Objetivo:

El objetivo principal de este proyecto, es permitir que los analistas funcionales, aun sin contar con licencia de Azure DevOps, puedan:

- Actualizar el resultado de sus casos de prueba.
- Registrar evidencias de ejecución.
- Reducir la dependencia operativa del equipo QA.
- Disminuir tiempos de gestión y reprocesos.

## 📁 Arquitectura del Proyecto:

Equipo Físico - MAC
    ├── Maquina Virtual - Colima
        ├── Sistema Operativo - Alpine Linux
            ├── Docker
                ├── Nginx
                    ├── defauld.conf
                ├── n8n
                    ├── QA Test Result Record - QA y Produccion.json
                ├── Formulario-QA Test Result Record
                    ├── index.html
                    ├── conf.html
                    ├── css
                    ├── js
                    ├── README.md

## 🚀 Características:

- Registro de resultados de pruebas QA.
- Configuración para ambientes QA y Producción.
- Preparado para pruebas UAT (User Acceptance Testing).

## 💻 Tecnologías

- Azure Devops
- n8n

## Funcionalidad:

URL Productivo:
http://10.108.10.137/azure-app/index.html

URL QA:
http://10.108.10.137/azure-app-qa/index.html




**Última actualización:** Marzo 2026