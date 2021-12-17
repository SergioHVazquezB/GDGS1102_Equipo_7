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
                console.error('El usuario cancelo la instalación');
            }
        }
    });
});