use sea_orm::ActiveValue;

use crate::{
    dto::context::{ContextRequest, ContextResponse},
    mappers::context,
    models,
    repositories::context::ContextRepository,
};

pub struct ContextService<'a> {
    context_repository: ContextRepository<'a>,
}

impl<'a> ContextService<'a> {
    pub fn new(context_repository: ContextRepository<'a>) -> Self {
        Self { context_repository }
    }

    pub async fn get(&self) -> Vec<ContextResponse> {
        println!("Getting all contexts...");

        let contexts = self.context_repository.get().await.unwrap();

        println!("Contexts retrieved successfully.");

        contexts
            .into_iter()
            .map(|context| context::model_to_response(context))
            .collect()
    }

    pub async fn add(&self, request: ContextRequest) {
        println!("Adding new context...");

        let context = self
            .context_repository
            .add(context::request_to_active_model(request))
            .await
            .unwrap();

        println!("Context added successfully: {}", context.id);
    }

    pub async fn edit(&self, context_id: i32, request: ContextRequest) {
        println!("Getting context: {context_id}...");

        if let Some(column) = self.context_repository.get_by_id(context_id).await.unwrap() {
            println!("Editing context...");

            let mut active_model: models::context::ActiveModel = column.into();

            active_model.name = ActiveValue::Set(request.name);

            self.context_repository.update(active_model).await.unwrap();

            println!("Context edited successfully.");
        } else {
            println!("Context not found.");
        }
    }

    pub async fn delete(&self, context_id: i32) {
        println!("Deleting context: {context_id}...");

        self.context_repository.delete(context_id).await.unwrap();

        println!("Context deleted successfully.");
    }
}
