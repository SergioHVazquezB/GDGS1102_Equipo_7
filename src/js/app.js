/* Declaracion de variables globales */
let MAIN;
let MODAL_POST;
let BTN_SHOW_POST;
let BTN_CANCEL_POST;
let deferredPrompt;
let TITLE;
let DESCRIPTION;

// Funciones______________________________________________________________________________________________________
const showPostModal = () => {
    MAIN.style.display = 'none';
    MODAL_POST.style.display = 'block';
    setTimeout(() => {
        MODAL_POST.style.transform = 'translateY(0)';
    }, 1);
};
//Esconde el modal
const closePostModal = () => {
    MAIN.style.display = 'block';
    MODAL_POST.style.transform = 'translateY(100vh)';
};
const sendData = async (e) => {
    try {
        e.preventDefault();
        TITLE = document.querySelector('#title').value;
        DESCRIPTION = document.querySelector('#description').value;
        if (TITLE && DESCRIPTION) {
            await db.collection('posts').add({
                title: TITLE,
                description: DESCRIPTION,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            const data = {
                message: 'Registro exitosamente almacenado',
                timeout: 5000
            };
            Message().MaterialSnackbar.showSnackbar(data);
        } else {
            const data = {
                message: 'Faltan campos por llenar',
                timeout: 1500
            };
            Message('error').MaterialSnackbar.showSnackbar(data);
        }
    } catch (error) {
        const data = {
            message: error.message,
            timeout: 1500
        };
        Message('error').MaterialSnackbar.showSnackbar(data);
    }
};
//
const requestPermission = async () => {
    const result = await Notification.requestPermission();
    if (result !== 'granted') {
        const data = {
            message: 'El usuario no activo las notificaciones',
            timeout: 5000
        };
        Message('error').MaterialSnackbar.showSnackbar(data);
    } else {
        //configuracionSubscripcion();
         showNotification();
    }
};
const showNotification = () => {
    // new Notification('Notificaciones exitosamente activadas');
    navigator.serviceWorker.getRegistration()
        .then(instancia => {
            instancia.showNotification('Notificaciones exitosamente activadas para el dispositivo', {
                body: 'El cuerpo de la notificacion',
                icon: 'src/images/icons/icon-144x144.png',
                image: 'src/images/computer.jpg',
                badge: 'src/images/icons/icon-144x144.png',
                dir: 'ltr',
                tag: 'notification-postme',
                requireInteraction: true,
                vibrate: [100, 50, 200],
                actions: [
                    { action: 'confirm', title: 'Aceptar', icon: 'src/images/icons/icon-144x144.png' },
                    { action: 'cancel', title: 'Cancelar', icon: 'src/images/icons/icon-144x144.png' }
                ]
            });
        })
        .catch(err => console.error(err.message))
};
//interrumpe modal de instalacion
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});
// Cuando se cargue todo nuestro DOM______________________________________________________________________________
window.addEventListener('load', async () => {

    // Declarando mi instancia de base de datos creada por PouchDB
    //DB_POUCH = new PouchDB('posts');

    MAIN = document.querySelector('#main');
    MODAL_POST = document.querySelector('#modal-post-section');
    BTN_SHOW_POST = document.querySelector('#btn-upload-post');
    BTN_SHOW_POST.addEventListener('click', showPostModal);
    BTN_CANCEL_POST = document.querySelector('#btn-post-cancel');
    BTN_CANCEL_POST.addEventListener('click', closePostModal);

    //serviceworker
    if ('serviceWorker' in navigator) {
        const response = await navigator.serviceWorker.register('sw.js');
        if (response) {
            console.info('Service worker registrado');
        }
    }
    //Toast Container.
    window.Message = (option = 'success', container = document.querySelector('#toast-container')) => {
        container.classList.remove('success');
        container.classList.remove('error');
        container.classList.add(option);
        return container;
    };
    window.Loading = (option = 'block') => {
        document.querySelector('#loading').style.display = option;
    };
    // Seccion notificaciones
    BTN_NOTIFICATIONS = document.querySelector('#notifications-install');
    BTN_NOTIFICATIONS.addEventListener('click', requestPermission);
    //Boton anviar post.
    const btnPostSubmit = document.querySelector('#btn-post-submit');
    btnPostSubmit.addEventListener('click', (e) => sendData(e));
    //banerr install.
    const bannerInstall = document.querySelector('#banner-install');
    bannerInstall.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const response = await deferredPrompt.userChoice;
            if (response.outcome === 'dismissed') {
                console.error('El usuario cancelo la instalaci??n');
            }
        }
    });
});