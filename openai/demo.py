import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

start_sequence = "###"

response = openai.Completion.create(
  model="curie:ft-personal:text-curie-wenai-001-2023-02-17-09-32-19",
  prompt="我肚子饿了。###",
  temperature=0.7,
  max_tokens=100,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0
)
print(response)