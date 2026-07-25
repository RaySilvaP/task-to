use sea_orm::ActiveValue;

use crate::{
    dto::tag::{TagRequest, TagResponse},
    models,
    repositories::tag::TagRepository,
};

pub struct TagService<'a> {
    tag_repository: TagRepository<'a>,
}

impl<'a> TagService<'a> {
    pub fn new(tag_repository: TagRepository<'a>) -> Self {
        Self { tag_repository }
    }

    pub async fn get(&self) -> Vec<TagResponse> {
        println!("Getting all tags...");

        let tags = self.tag_repository.get().await.unwrap();

        println!("Tags retrieved successfully.");

        tags.into_iter()
            .map(crate::mappers::tag::model_to_response)
            .collect()
    }

    pub async fn add(&self, request: TagRequest) -> i32 {
        println!("Adding new tag...");

        let now = chrono::Utc::now().to_rfc3339();
        let mut active_model = crate::mappers::tag::request_to_active_model(request);
        active_model.created_at = ActiveValue::Set(now.clone());
        active_model.updated_at = ActiveValue::Set(now);

        let tag = self.tag_repository.add(active_model).await.unwrap();

        println!("Tag added successfully: {}", tag.id);

        tag.id
    }

    pub async fn edit(&self, tag_id: i32, request: TagRequest) {
        println!("Getting tag: {tag_id}...");

        if let Some(tag) = self.tag_repository.get_by_id(tag_id).await.unwrap() {
            println!("Editing tag...");

            let mut active_model: models::tag::ActiveModel = tag.into();

            active_model.name = ActiveValue::Set(request.name);
            active_model.color = ActiveValue::Set(request.color);
            active_model.updated_at = ActiveValue::Set(chrono::Utc::now().to_rfc3339());

            self.tag_repository.update(active_model).await.unwrap();

            println!("Tag edited successfully.");
        } else {
            println!("Tag not found.");
        }
    }

    pub async fn delete(&self, tag_id: i32) {
        println!("Deleting tag: {tag_id}...");

        self.tag_repository.delete(tag_id).await.unwrap();

        println!("Tag deleted successfully.");
    }
}
