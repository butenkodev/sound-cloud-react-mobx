import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Pause, PlayArrow } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../app-context';
import { ImageSize } from '../../enums';
import { Track } from '../../models/track';
import { formatNumber, fromNow, getImageUrl, isPreview } from '../../utils';
import { Bullet } from '../Bullet';
import Overlay from '../Overlay';

const useStyles = makeStyles({
  imagePlaceholder: {
    paddingTop: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    background: 'hsla(0, 0%, 6.7%, 0.8)',
  },
});

// TODO: split into 2 components: TrackCard & TrackCardContent
const TrackCard = ({
  track,
  compact = false,
  tracks = [track], // TODO: TrackCard should nщt know about other tracks
}: {
  track: Track;
  compact?: boolean;
  tracks?: Track[];
}) => {
  const { playerStore } = useContext(AppContext);
  const classes = useStyles();

  const handlePlayClick = () => {
    playerStore.playTrack(track, tracks.slice());
  };

  const isCurrentTrack = !!playerStore.isSelected(track);
  const isPlaying = playerStore.isSelected(track) === 'isPlaying';

  return (
    <Card>
      <CardMedia
        image={getImageUrl(track.artwork_url, ImageSize.t500x500)}
        title={track.title}
      >
        <Overlay
          overlayContent={
            <IconButton
              onClick={handlePlayClick}
              aria-label={isPlaying ? 'pause' : 'play'}
            >
              {isPlaying ? (
                <Pause fontSize="large" color="secondary" />
              ) : (
                <PlayArrow fontSize="large" color="secondary" />
              )}
            </IconButton>
          }
          shown={isCurrentTrack}
          showOnMouseIn={true}
        >
          <div className={classes.imagePlaceholder}>
            {isPreview(track) && (
              <div className={classes.previewOverlay}>
                <Typography>Preview</Typography>
              </div>
            )}
          </div>
        </Overlay>
      </CardMedia>

      {!compact && (
        <CardContent>
          <Typography variant="subtitle2" noWrap>
            <Link
              to={`/users/${track.user.permalink}/tracks/${track.permalink}`}
            >
              {track.title}
            </Link>
          </Typography>
          <Typography variant="body2" noWrap>
            <Link to={`/users/${track.user.permalink}`}>
              {track.user.username}
            </Link>
          </Typography>
          <Typography variant="caption">
            {formatNumber(track.favoritings_count) + ' likes'}
            <Bullet />
            {fromNow(track.created_at)}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};

export default observer(TrackCard);
