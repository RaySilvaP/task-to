use serde::Deserialize;

#[derive(Deserialize)]
pub enum SessionType {
    Rest,
    Work,
    BigRest,
}
