# Event Photos

This directory is not currently used. Photos are stored in the asset pipeline.

## Directory Structure

Photos should be placed in the asset pipeline:

```
/app/assets/images/events/
├── london/          # Photos for the London event
├── paris/           # Photos for the Paris event
└── [event-slug]/    # Photos for other events
```

## Adding Photos

To add photos for an event:

1. Create a directory matching the event slug in `app/assets/images/events/` (e.g., `london`, `paris`)
2. Add your photos to that directory
3. Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
4. Photos will be displayed in alphabetical order

## Example

To add photos for the London event:
```bash
cp /path/to/your/photos/*.jpg app/assets/images/events/london/
```

## Viewing Photos

Photos can be viewed at: `/:event_slug/photos`
- Example: `/london/photos`
- Example: `/paris/photos`

## Notes

- Photos are displayed in a masonry grid with a vintage aesthetic
- Users can click photos to view them full-size
- The gallery uses the same passcode protection as the missed connections page
- Photos are served through the Rails asset pipeline
