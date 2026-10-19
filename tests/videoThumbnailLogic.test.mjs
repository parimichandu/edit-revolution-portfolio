import test from 'node:test';
import assert from 'node:assert/strict';

// Test the compiled or direct logic
import {
  isTargetVideoWithoutDefaultThumbnail,
  isYouTubeShorts,
  isCinematicEdit,
  shouldAddOrGenerateThumbnail,
  shouldDisplayThumbnail,
  getEffectiveThumbnailUrl,
} from '../src/utils/videoThumbnailLogic.ts';
import { PROJECTS } from '../src/data/projects.ts';

test('Requirement 1: E:\\klook redit .mp4 must not add or generate thumbnail by default', () => {
  const targetPath = 'E:\\klook redit .mp4';
  assert.equal(isTargetVideoWithoutDefaultThumbnail(targetPath), true, 'Must identify klook target video');

  const videoMeta = {
    category: 'YouTube Shorts',
    sourcePath: targetPath,
    title: 'Klook Travel Adventure — High-Retention YouTube Short',
    thumbnailUrl: '',
    enableThumbnail: false,
  };

  // Default evaluation (no user thumbnail option enabled)
  const shouldAddByDefault = shouldAddOrGenerateThumbnail(videoMeta);
  assert.equal(shouldAddByDefault, false, 'Should not add or generate thumbnail by default');

  const shouldDisplayByDefault = shouldDisplayThumbnail(videoMeta);
  assert.equal(shouldDisplayByDefault, false, 'Should not display thumbnail by default');

  const effectiveThumb = getEffectiveThumbnailUrl(videoMeta);
  assert.equal(effectiveThumb, undefined, 'Effective thumbnail URL must be undefined by default');
});

test('Requirement 2: E:\\0726 (1)(1).mp4 must apply the same rule (no thumbnail by default)', () => {
  const targetPath = 'E:\\0726 (1)(1).mp4';
  assert.equal(isTargetVideoWithoutDefaultThumbnail(targetPath), true, 'Must identify 0726 target video');

  const videoMeta = {
    category: 'YouTube Shorts',
    sourcePath: targetPath,
    title: 'Urban Motion Story — Fast-Paced YouTube Short',
    thumbnailUrl: '',
    enableThumbnail: false,
  };

  // Default evaluation
  const shouldAddByDefault = shouldAddOrGenerateThumbnail(videoMeta);
  assert.equal(shouldAddByDefault, false, 'Should not add or generate thumbnail by default');

  const shouldDisplayByDefault = shouldDisplayThumbnail(videoMeta);
  assert.equal(shouldDisplayByDefault, false, 'Should not display thumbnail by default');

  const effectiveThumb = getEffectiveThumbnailUrl(videoMeta);
  assert.equal(effectiveThumb, undefined, 'Effective thumbnail URL must be undefined by default');
});

test('Requirement 3: Add thumbnails ONLY when explicitly intended for YouTube Shorts AND user enables thumbnail option', () => {
  // Case A: YouTube Shorts with thumbnail option NOT enabled -> false
  const shortsWithoutOption = {
    category: 'YouTube Shorts',
    title: 'Random Shorts',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    enableThumbnail: false,
  };
  assert.equal(isYouTubeShorts(shortsWithoutOption), true, 'Must detect YouTube Shorts');
  assert.equal(shouldAddOrGenerateThumbnail(shortsWithoutOption, { userShortsThumbnailEnabled: false }), false);
  assert.equal(shouldDisplayThumbnail(shortsWithoutOption, false), false);

  // Case B: YouTube Shorts with thumbnail option enabled -> true
  const shortsWithOption = {
    category: 'YouTube Shorts',
    title: 'Random Shorts',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    enableThumbnail: true,
  };
  assert.equal(shouldAddOrGenerateThumbnail(shortsWithOption, { userShortsThumbnailEnabled: true }), true);
  assert.equal(shouldDisplayThumbnail(shortsWithOption, true), true);
  assert.equal(getEffectiveThumbnailUrl(shortsWithOption, true), 'https://example.com/thumb.jpg');

  // Case C: Non-Shorts video (e.g. Promotional Video) does not qualify under Shorts-only thumbnail rule
  const promoVideo = {
    category: 'Promotional Video',
    title: 'Brand Commercial',
    thumbnailUrl: 'https://example.com/promo.jpg',
  };
  assert.equal(isYouTubeShorts(promoVideo), false, 'Promotional video is not YouTube Shorts');
  assert.equal(shouldAddOrGenerateThumbnail(promoVideo, { userShortsThumbnailEnabled: true }), false, 'Non-Shorts video cannot generate Shorts thumbnail');
});

test('Requirement 4: For cinematic edits, NEVER add, generate, or display a thumbnail', () => {
  const cinematicProject = {
    id: 'sai-edits-reel',
    category: 'Cinematic Edits',
    title: 'Sai Cinematic Narrative Reel',
    thumbnailUrl: '/images/sai-cinematic-thumb.jpg', // even if URL is supplied
    enableThumbnail: true, // even if option is passed as true
  };

  assert.equal(isCinematicEdit(cinematicProject), true, 'Must detect Cinematic Edit');
  assert.equal(
    shouldAddOrGenerateThumbnail(cinematicProject, { userShortsThumbnailEnabled: true }),
    false,
    'Cinematic edits must NEVER generate or add a thumbnail'
  );
  assert.equal(
    shouldDisplayThumbnail(cinematicProject, true),
    false,
    'Cinematic edits must NEVER display a thumbnail'
  );
  assert.equal(
    getEffectiveThumbnailUrl(cinematicProject, true),
    undefined,
    'Cinematic edits must return undefined effective thumbnail'
  );
});

test('Requirement 5: Dataset verification for PROJECTS list', () => {
  // Check Cinematic Edits projects
  const cinematicProjects = PROJECTS.filter((p) => p.category === 'Cinematic Edits');
  assert.ok(cinematicProjects.length > 0, 'Must have cinematic edits projects');
  for (const proj of cinematicProjects) {
    assert.equal(proj.thumbnailUrl, '', `Cinematic edit "${proj.title}" thumbnailUrl must be empty`);
    assert.equal(shouldDisplayThumbnail(proj), false, `Cinematic edit "${proj.title}" must not display thumbnail`);
    assert.equal(proj.aspectRatio, '16:9', `Cinematic edit "${proj.title}" must have 16:9 aspect ratio`);
  }

  // Check Target YouTube Shorts projects
  const klookProject = PROJECTS.find((p) => p.id === 'klook-redit-short');
  assert.ok(klookProject, 'klook-redit-short project must be in PROJECTS');
  assert.equal(klookProject.category, 'YouTube Shorts');
  assert.equal(klookProject.thumbnailUrl, '', 'klook project must have empty thumbnailUrl by default');
  assert.equal(klookProject.videoPreviewUrl, '/videos/klook-redit.mp4');
  assert.equal(shouldDisplayThumbnail(klookProject, false), false, 'klook must not display thumbnail by default');

  const urban0726Project = PROJECTS.find((p) => p.id === 'urban-narrative-0726-short');
  assert.ok(urban0726Project, 'urban-narrative-0726-short project must be in PROJECTS');
  assert.equal(urban0726Project.category, 'YouTube Shorts');
  assert.equal(urban0726Project.thumbnailUrl, '', '0726 project must have empty thumbnailUrl by default');
  assert.equal(urban0726Project.videoPreviewUrl, '/videos/0726-shorts.mp4');
  assert.equal(shouldDisplayThumbnail(urban0726Project, false), false, '0726 must not display thumbnail by default');

  // Check Vrindavan Travel Short (added from D:\where we need to stay in vrindavan.mp4)
  const vrindavanProject = PROJECTS.find((p) => p.id === 'vrindavan-travel-short');
  assert.ok(vrindavanProject, 'vrindavan-travel-short project must be in PROJECTS');
  assert.equal(vrindavanProject.category, 'YouTube Shorts');
  assert.equal(vrindavanProject.thumbnailUrl, '', 'vrindavan project must have empty thumbnailUrl by default');
  assert.equal(vrindavanProject.videoPreviewUrl, '/videos/where-we-need-to-stay-in-vrindavan.mp4');
  assert.equal(shouldDisplayThumbnail(vrindavanProject, false), false, 'vrindavan must not display thumbnail by default');
  assert.equal(isTargetVideoWithoutDefaultThumbnail('D:\\where we need to stay in vrindavan.mp4'), true);

  // Check Sir Avatar Project (added from D:\sir avatar project.mp4)
  const sirAvatarProject = PROJECTS.find((p) => p.id === 'sir-avatar-project');
  assert.ok(sirAvatarProject, 'sir-avatar-project project must be in PROJECTS');
  assert.equal(sirAvatarProject.category, 'AI Video Creation');
  assert.equal(sirAvatarProject.thumbnailUrl, '', 'sir avatar project must have empty thumbnailUrl by default');
  assert.equal(sirAvatarProject.videoPreviewUrl, '/videos/sir-avatar-project.mp4');
  assert.equal(shouldDisplayThumbnail(sirAvatarProject, false), false, 'sir avatar must not display thumbnail by default');

  // Check Promotional Video (added from C:\Users\WELCOME\Downloads\promotion reel.mp4)
  const promoProject = PROJECTS.find((p) => p.id === 'edit-revolution-promo-reel');
  assert.ok(promoProject, 'edit-revolution-promo-reel project must be in PROJECTS');
  assert.equal(promoProject.category, 'Promotional Video');
  assert.equal(promoProject.videoPreviewUrl, '/videos/promotion-reel.mp4');
  assert.equal(promoProject.aspectRatio, '9:16');
});

