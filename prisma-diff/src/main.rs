use migration_core::commands::{CreateMigrationInput, CreateMigrationOutput};
use migration_core::{migration_api, CoreResult};
use std::env;
use std::fs::File;
use std::io::prelude::*;
// use futures::executor::block_on;
use futures::executor;

#[tokio::main]
async fn main() {
    let handle = tokio::runtime::Handle::current();
    handle.enter();
    let future = create_migrations_from_foreign_schema();
    executor::block_on(future);
}

async fn create_migrations_from_foreign_schema() -> CoreResult<()> {
    let filename = "../db/prisma-new.prisma";
    let migrations_folder = String::from("../db/migrations");
    let mut f = File::open(filename).expect("File not found");
    let mut datamodel = String::new();

    f.read_to_string(&mut datamodel)
      .expect("Something went wrong reading the file");

    let executor = migration_api(&datamodel).await?;
    let migration_name = String::from("add_external_changes");

    let input = CreateMigrationInput {
      prisma_schema: datamodel,
      migration_name: migration_name,
      migrations_directory_path: migrations_folder,
      draft: false,
    };

    let output = executor.create_migration(&input).await?;
    let m = output
      .generated_migration_name
      .expect("Generated no migration");

    println!("New migration {}", m);

    Ok(())
}
