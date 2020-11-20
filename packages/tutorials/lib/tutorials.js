import React, { Component } from 'react';
import './Tutorials.css';

let aria = aria || {};

aria.KeyCode = {
	TAB: 9,
	RETURN: 13,
	ESC: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	DELETE: 46
};

export class TutorialsFeaturedImage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			media: []
		};
	}

	componentDidMount() {
		const API_URL = 'https://premium.wpmudev.org/blog/wp-json/wp/v2/media/';
		const QUERY_ID = this.props.media;

		// GET media using fetch.
		fetch( API_URL + QUERY_ID )
			.then( response => response.json() )
			.then(
				( data ) => {
					this.setState({
						isLoaded: true,
						media: data.guid.rendered
					});
				},
				( error ) => {
					this.setState({
						isLoaded: true,
						error
					});
				},
			);
	}

	render() {
		const { media, error, isLoaded } = this.state;

		if ( error ) {
			return;
		} else if ( ! isLoaded ) {
			return <div>Loading...</div>
		} else {
			return <img src={ media } />
		}
	}
}

export class Tutorials extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			posts: [],
			error: null,
			isLoaded: false,
		};

		this.openLink = this.openLink.bind( this );
	}

	openLink = ( e ) => {
		let ref = e.target !== null ? e.target : e.srcElement;

		if ( ref ) {
			window.open( ref.getAttribute( 'data-href' ), '_blank' );
		}
	}

	openLinkKey = ( e ) => {
		let key = e.which || e.keyCode;

		switch ( key ) {
			case aria.KeyCode.RETURN :
				this.openLink( e )
				break;
		}
	}

	componentDidMount() {
		const API_URL = 'https://premium.wpmudev.org/blog/wp-json/wp/v2/posts?tutorials_categories=';
		const QUERY_ID = this.props.category;

		// GET posts using fetch.
		fetch( API_URL + QUERY_ID )
			.then( response => response.json() )
			.then(
				( data ) => {
					this.setState({
						isLoaded: true,
						posts: data
					});
				},
				( error ) => {
					this.setState({
						isLoaded: true,
						error
					});
				},
			);
	}

	render() {
		const { posts, error, isLoaded } = this.state;

		const listPosts = posts.map( post => (
			<li
				key={ post.id }
				className="sui-tutorial"
			>
				<div
					tabIndex="0"
					role="link"
					data-href={ post.link }
					onClick={ ( e ) => this.openLink( e ) }
					onKeyPress={ ( e ) => this.openLinkKey( e ) }
				>

					<div
						className="sui-tutorial--header"
						style={ { pointerEvents: 'none' } }
					>

						<TutorialsFeaturedImage media={ post.featured_media } />

						<div className="sui-tutorial--header-content">
							<h3 className="sui-tutorial--title">{ post.title.rendered }</h3>
						</div>

					</div>

					<div className="sui-tutorial--body">
						<div className="sui-tutorial--body-excerpt" dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
						<p className="sui-description pseudo-link" aria-hidden="true">{ post.readMore }</p>
					</div>

				</div>
			</li>
		) );

		if ( error ) {
			return (
				<div>Error: { error.message }</div>
			);
		} else if ( ! isLoaded ) {
			return (
				<div>Loading content...</div>
			);
		} else {
			return (
				<div className="sui-box">

					<div className="sui-box-header">
						<h3 className="sui-box-title">{ this.props.title }</h3>
					</div>

					<div
						className="sui-box-body"
						style={ {
							backgroundColor: '#FAFAFA',
							borderBottomRightRadius: '4px',
							borderBottomLeftRadius: '4px',
						} }
					>

						<ul className="sui-tutorials--page">{ listPosts }</ul>

					</div>

				</div>
			);
		}
	}
}