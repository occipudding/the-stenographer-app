require 'faker'

Note.destroy_all
Topic.destroy_all
User.destroy_all

# USERS
# user_1 = User.create(name: 'Rod', topics: [], notes: [])
# user_2 = User.create(name: 'Todd', topics: [], notes: [])
# user_3 = User.create(name: 'Ned', topics: [], notes: [])
30.times do
  User.create(name: Faker::Name.name)
end

# TOPICS
# topic_1 = Topic.create(title: 'Science', tags: ['science', 'biology', 'chemistry'], user: user_1)
# topic_2 = Topic.create(title: 'Sports', tags: ['balls', 'sweaty dudes', 'eating nuts', 'CTE'], user: user_3)
# topic_3 = Topic.create(title: 'Music', tags: ['polyrhythms', 'polytonality', 'microtonality', 'timbre'], user: user_2)
50.times do
  arr = []
  Topic.create(title: Faker::Hipster.word.capitalize, tags: Random.new.rand(0..10).times{|| arr << Faker::Hipster.word}, user: User.all.sample)
end

# NOTES
50.times do
  Note.create(content: Faker::Hipster.sentence, topic_id: Topic.all.sample.id)
end
