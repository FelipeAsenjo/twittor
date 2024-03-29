importScripts('js/sw-utils.js')



const STATIC_CACHE = 'static-v3'
const DYNAMIC_CACHE = 'dynamic-v1'
const IMMUTABLE_CACHE = 'immutable-v1'


const APP_SHELL = [
	'/',
	'index.html',
	'css/style.css',
	'img/favicon.ico',
	'img/avatars/hulk.jpg',
	'img/avatars/spiderman.jpg',
	'img/avatars/thor.jpg',
	'img/avatars/ironman.jpg',
	'img/avatars/wolverine.jpg',
	'js/app.js'
]

const APP_SHELL_IMMUTABLE = [
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',	
	"https://use.fontawesome.com/releases/v5.3.1/css/all.css",
	"css/animate.css",
	"js/libs/jquery.js"
]


self.addEventListener('install', e => {
	
	// inicializar todos los caches fijos

	const cacheStatic =	caches.open( STATIC_CACHE ).then( cache => {

		cache.addAll( APP_SHELL )
	} )

	const cacheImmutable =	caches.open( IMMUTABLE_CACHE ).then( cache => {

		cache.addAll( APP_SHELL_IMMUTABLE )
	} )


	e.waitUntil( Promise.all([cacheStatic, cacheImmutable]) )
})




self.addEventListener('activate', e => {

	// eliminar versiones de caches antiguos si es que existen
	
	const response = caches.keys().then( keys => {

		keys.forEach( key => {

			if( key !== STATIC_CACHE && key.includes('static') ) {

				return caches.delete( key )

			}
		} )
	} )


	e.waitUntil( response )
})



self.addEventListener('fetch', e => {

	// cache with network fallback
	
	const response = caches.match( e.request ).then( res => {

		if( res ) {
			return res
		} else {

			return fetch( e.request ).then( fetchRes => {

				return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, fetchRes )
			} )


		}
	} )
	

	e.respondWith( response )
})
