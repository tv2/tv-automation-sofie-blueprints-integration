import { Time } from './common'
import { SomeContent } from './content'
import { Timeline } from './timeline'
import { Omit } from './lib'

/** The Rundown generated from Blueprint */
export interface IBlueprintRundown {
	externalId: string
	/** Rundown slug - user-presentable name */
	name: string

	/** Expected start should be set to the expected time this rundown should run on air */
	expectedStart?: Time
	/** Expected duration of the rundown */
	expectedDuration?: number

	/** Arbitrary data storage for plugins */
	metaData?: {[key: string]: any}
}
/** The Rundown sent from Core */
export interface IBlueprintRundownDB extends IBlueprintRundown {
	_id: string

	/** Id of the showStyle variant used */
	showStyleVariantId: string
}

/** Collection of runtime arguments to apply */
export interface BlueprintRuntimeArguments {
	[key: string]: string
}

/** Base type of the runtime arguments */
export interface IBlueprintRuntimeArgumentsItem {
	_id: string
	label?: string
	hotkeys: string
	property: string
	value: string
}

/** The Segment generated from Blueprint */
export interface IBlueprintSegment {
	/** User-presentable name (Slug) for the Title */
	name: string
	/** Arbitrary data storage for plugins */
	metaData?: {[key: string]: any}
	/** Hide the Segment in the UI */
	isHidden?: boolean
}
/** The Segment sent from Core */
export interface IBlueprintSegmentDB extends IBlueprintSegment {
	_id: string
}

/** The Part generated from Blueprint */
export interface IBlueprintPart {
	externalId: string
	/** The story title */
	title: string
	/** Arbitrary data storage for plugins */
	metaData?: {[key: string]: any}

	/** Should this item should progress to the next automatically */
	autoNext?: boolean
	/** How much to overlap on when doing autonext */
	autoNextOverlap?: number
	/** How long to before this part is ready to take over from the previous */
	prerollDuration?: number
	/** How long to before this part is ready to take over from the previous (during transition) */
	transitionPrerollDuration?: number | null
	/** How long to keep the old part alive during the transition */
	transitionKeepaliveDuration?: number | null
	/** How long the transition is active for */
	transitionDuration?: number | null
	/** Should we block a transition at the out of this Part */
	disableOutTransition?: boolean

	/** Expected duration of the line, in milliseconds */
	expectedDuration?: number

	/** The type of the segmentLiene, could be the name of the template that created it */
	typeVariant: string
	/** The subtype fo the part */
	subTypeVariant?: string

	/** Whether this segment line supports being used in HOLD */
	holdMode?: PartHoldMode

	/** Set to true if ingest-device should be notified when this part starts playing */
	shouldNotifyCurrentPlayingPart?: boolean

	/** Classes to set on the TimelineGroupObj for this part */
	classes?: string[]
	/** Classes to set on the TimelineGroupObj for the following part */
	classesForNext?: string[]

	displayDurationGroup?: string
	displayDuration?: number

	/** When something bad has happened, we can mark the part as invalid, which will prevent the user from TAKE:ing it */
	invalid?: boolean
}
/** The Part sent from Core */
export interface IBlueprintPartDB extends IBlueprintPart {
	_id: string
	/** The segment ("Title") this line belongs to */
	segmentId: string

	/** Playout timings, in here we log times when playout happens */
	timings?: IBlueprintPartDBTimings
}

export interface IBlueprintPartDBTimings {
	/** Point in time the Part was taken, (ie the time of the user action) */
	take: Array<Time>,
	/** Point in time the "take" action has finished executing */
	takeDone: Array<Time>,
	/** Point in time the Part started playing (ie the time of the playout) */
	startedPlayback: Array<Time>,
	/** Point in time the Part stopped playing (ie the time of the user action) */
	takeOut: Array<Time>,
	/** Point in time the Part stopped playing (ie the time of the playout) */
	stoppedPlayback: Array<Time>,
	/** Point in time the Part was set as Next (ie the time of the user action) */
	next: Array<Time>
}
export enum PartHoldMode {
	NONE = 0,
	FROM = 1,
	TO = 2
}
export type PieceMetaData = { [key: string]: any }
export interface IBlueprintPieceGeneric {
	/** ID of the source object in the gateway */
	externalId: string
	/** The segment line this item belongs to - can be undefined for global ad lib pieces */
	partId?: string
	/** User-presentable name for the timeline item */
	name: string
	/** Arbitrary data storage for plugins */
	metaData?: PieceMetaData

	/** Source layer the timeline item belongs to */
	sourceLayerId: string
  	/** Layer output this piece belongs to */
	outputLayerId: string
	/** The object describing the item in detail */
	content?: SomeContent

	infiniteMode?: PieceLifespan

	/** Duration to preroll/overlap when running this adlib */
	adlibPreroll?: number
}

export type PieceEnable = Omit<Timeline.TimelineEnable, 'while' | 'repeating'>

/** A Single item in a "line": script, VT, cameras. Generated by Blueprint */
export interface IBlueprintPiece extends IBlueprintPieceGeneric {
	_id: string

	/** Timeline enabler. When the piece should be active on the timeline. */
	enable: PieceEnable
	/** Whether the piece is a real piece, or exists as a marker to stop an infinite piece. If virtual, it does not add any contents to the timeline */
	virtual?: boolean
	/** The id of the item this item is a continuation of. If it is a continuation, the inTranstion must not be set, and trigger must be 0 */
	continuesRefId?: string
	isTransition?: boolean
	extendOnHold?: boolean
}
export interface IBlueprintPieceDB extends IBlueprintPiece {
	playoutDuration?: number

	/** This is the id of the original segment of an infinite piece chain. If it matches the id of itself then it is the first in the chain */
	infiniteId?: string
}

export interface IBlueprintAdLibPiece extends IBlueprintPieceGeneric {
	/** Used for sorting in the UI */
	_rank: number
	/** When something bad has happened, we can mark the AdLib as invalid, which will prevent the user from TAKE:ing it */
	invalid?: boolean
	/** Expected duration of the piece, in milliseconds */
	expectedDuration?: number
	/** User-defined tags that can be used for filtering in the Rundown Layouts without modifying the label */
	tags?: string[]
}
/** The AdLib piece sent from Core */
export interface IBlueprintAdLibPieceDB extends IBlueprintAdLibPiece {
	_id: string
}

export enum PieceLifespan {
	Normal = 0,
	OutOnNextPart = 1,
	OutOnNextSegment = 2,
	Infinite = 3
}
