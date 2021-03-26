import React from 'react';
import {
    auth,
    remote,
    ApiConfig,
    ApiScope,
    SpotifyRemoteApi,
    PlayerState,
    PlayerContext,
    RepeatMode,
    ContentItem,
    SpotifyAuth
} from 'react-native-spotify-remote';
import {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_REDIRECT_URL,
    SPOTIFY_TOKEN_REFRESH_URL,
    SPOTIFY_TOKEN_SWAP_URL
} from 'react-native-dotenv';

interface AuthOptions {
    playURI?: string;
    showDialog?: boolean;
    autoConnect?: boolean;
}

interface AppContextState {
    error?: Error & { code?: any };
    playerState?: PlayerState;
    token?: string;
    isConnected?: boolean;
}

export interface AppContextProps extends AppContextState {
    onError: (err: Error) => void;
    authenticate: (options?: AuthOptions) => void;
    clearError: () => void;
    endSession: () => void;
    remote: SpotifyRemoteApi,
    auth: SpotifyAuth
}

const noop = () => { };
const DefaultContext: AppContextProps = {
    onError: noop,
    authenticate: noop,
    clearError: noop,
    endSession: noop,
    remote,
    auth
}

const AppContext = React.createContext<AppContextProps>(DefaultContext);

class AppContextProvider extends React.Component<{}, AppContextState> {
    state = {
        isConnected: false
    }

    constructor(props: any) {
        super(props);
        this.onError = this.onError.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.clearError = this.clearError.bind(this);
        this.onConnected = this.onConnected.bind(this);
        this.onDisconnected = this.onDisconnected.bind(this);
        this.onPlayerStateChanged = this.onPlayerStateChanged.bind(this);
        this.onPlayerContextChanged = this.onPlayerContextChanged.bind(this);
        this.endSession = this.endSession.bind(this);
    }

    componentDidMount() {
        remote.on("remoteConnected", this.onConnected)
            .on("remoteDisconnected", this.onDisconnected)
            .on("playerStateChanged", this.onPlayerStateChanged)
            .on("playerContextChanged", this.onPlayerContextChanged);

        auth.getSession().then((session) => {
            if (session != undefined && session.accessToken != undefined) {
                this.setState((state) => ({ ...state, token: session.accessToken }))
                remote.connect(session.accessToken)
                    .then(() => this.setState((state) => ({
                        ...state,
                        isConnected: true
                    })))
                    .catch(this.onError);
            }
        });
    }

    componentWillUnmount() {
        remote.removeAllListeners();
    }

    private onError(error: Error) {
        this.setState((state) => ({ ...state, error }))
    }

    private clearError() {
        this.setState((state) => ({ ...state, error: undefined }));
    }

    private onConnected() {
        this.setState((state) => ({
            ...state,
            isConnected: true
        }));
    }

    private onDisconnected() {
        this.setState((state) => ({
            ...state,
            isConnected: false
        }));
    }

    private onPlayerStateChanged(playerState: PlayerState) {
        this.setState((state) => ({
            ...state,
            playerState
        }));
    };

    private onPlayerContextChanged(playerContext: PlayerContext) {
        this.setState((state) => ({
            ...state,
            playerContext
        }));
    };

    private endSession() {
        auth.endSession().then(() => {
            remote.disconnect().then(() => {
                this.setState({ isConnected: false, token: undefined });
            });
        });
    }

    private async authenticate({ playURI, showDialog = false }: AuthOptions = {}) {
        const config: ApiConfig = {
            clientID: SPOTIFY_CLIENT_ID,
            redirectURL: SPOTIFY_REDIRECT_URL,
            tokenRefreshURL: SPOTIFY_TOKEN_REFRESH_URL,
            tokenSwapURL: SPOTIFY_TOKEN_SWAP_URL,
            scopes: [ApiScope.AppRemoteControlScope],
            playURI,
            showDialog
        };

        try {
            // Go and check if things are connected
            const isConnected = await remote.isConnectedAsync()
            this.setState((state) => ({
                ...state,
                isConnected
            }));

            // Initialize the session
            const { accessToken } = await auth.authorize(config);
            this.setState((state) => ({
                ...state,
                token: accessToken
            }));
            await remote.connect(accessToken);
        } catch (err) {
            this.onError(err);
        }
    }

    render() {
        const { children } = this.props
        return (
            <AppContext.Provider
                value={{
                    ...DefaultContext,
                    ...this.state,
                    onError: this.onError,
                    authenticate: this.authenticate,
                    clearError: this.clearError,
                    endSession: this.endSession
                }}
            >
                {children}
            </AppContext.Provider>
        )
    }
}

export default AppContext;
export { AppContextProvider };