# RIDGE Database Schema

## users
id
email
username
display_name
state
created_at

## hunts
id
user_id
start_time
end_time
weapon_type
notes

## stand_locations
id
user_id
name
geom
notes

## trail_cameras
id
user_id
name
geom

## posts
id
user_id
caption
created_at

## comments
id
post_id
user_id
body

## harvests
id
user_id
species
score_estimate
harvest_date

## trophy_entries
id
harvest_id
category
season_year
ranking_score
