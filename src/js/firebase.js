const firebaseConfig = {
    apiKey: "AIzaSyANmU7Mr5xfjFWqRc7DUw_eW_fZNpy8pX0",
    authDomain: "postme-app-bd.firebaseapp.com",
    projectId: "postme-app-bd",
    storageBucket: "postme-app-bd.appspot.com",
    messagingSenderId: "662094527575",
    appId: "1:662094527575:web:dc7e138892738ececff712",
    measurementId: "G-W3G0V11CV1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
//-------------------------------------------------------------configurar dayjs
dayjs.extend(window.dayjs_plugin_relativeTime);
const locale = {
    name: 'es',
    monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    weekStart: 1,
    formats: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY H:mm',
        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
    },
    relativeTime: {
        future: 'en %s',
        past: 'hace %s',
        s: 'unos segundos',
        m: 'un minuto',
        mm: '%d minutos',
        h: 'una hora',
        hh: '%d horas',
        d: 'un día',
        dd: '%d días',
        M: 'un mes',
        MM: '%d meses',
        y: 'un año',
        yy: '%d años'
    },
    ordinal: (n) => `${n}º`
};
dayjs.locale(locale, null, true);
dayjs.locale('es');
