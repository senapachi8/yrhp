<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wptesthachi' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'Y[:7>MTr HSn(Os+~CDQpx{.qza)zet@r|H/LaBI|#Mp/r6JuI&:swzzI_@OHFCx' );
define( 'SECURE_AUTH_KEY',  ':TxG}(oQ)taP5{nGJT^Lu!_0#M*@!nCe@7YO8y,|}`=AY0KUaMGfXVJSMv8ePY18' );
define( 'LOGGED_IN_KEY',    '5PoI/-fqqQUn$jM9n=[aKLk75|j:(rs8#[Eujf^k8QM&L)<M9B/c4)w|}3N&R]&X' );
define( 'NONCE_KEY',        ')ah&!jD/IFV>s6;CF>@zBDA7Xmjcq)u.{G59~nW{~**Hb2&Uzc1ie+Tc?s/~}}4/' );
define( 'AUTH_SALT',        '3&>AB@F>ug-hG^2rG| |QR%xpvH}{sG n}$61,N~!4&.8k={$T)rSG{FuAMQI,-.' );
define( 'SECURE_AUTH_SALT', 'MGk0pL_D&d=+.}pJtR$i4r62{Ed*6Xb]*[ A|31K,u[hy8u.@Iu+9Vo$ksS G&^A' );
define( 'LOGGED_IN_SALT',   ')Uv|:.}Ts6]7XG-HL_Bb9_.NO+9BgV]^nLXSi6+2>gNzoe!vp%FnJrhO]JR2v`&P' );
define( 'NONCE_SALT',       'Ss(4XLXZtT0M3lY@4icnE(1,WR 6Rto[F,l:68#JGW!b0!xDuP!CMBD}ix$ 6#-S' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
