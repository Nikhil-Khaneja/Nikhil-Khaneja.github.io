(()=>{
"use strict";
const GH = r => "https://github.com/Nikhil-Khaneja/" + r;
const LANES = [
  {id:"arc",  name:"Focus",        color:"--arc", w:0.62},
  {id:"edu",  name:"Education",    color:"--edu", w:0.85},
  {id:"exp",  name:"Experience",   color:"--exp", w:1.05},
  {id:"proj", name:"Projects",     color:"--proj", w:1.4},
  {id:"ach",  name:"Achievements", color:"--ach", w:1.05},
];

// [start, end] as "YYYY-MM". end null = single point. Facts come from repos and user-confirmed resume content.
const ITEMS = [
  // ---------- FOCUS (progress arc) ----------
  {id:"phase-web", lane:"arc", title:"Web foundations", sub:"HTML · PHP · Java", start:"2018-07", end:"2021-05", group:true,
   desc:"Undergrad years. I learned by shipping small web and desktop apps, then entered my first hackathon."},
  {id:"phase-platforms", lane:"arc", title:"Data platforms", sub:"Merkle · 4 years", start:"2021-07", end:"2025-07", group:true,
   desc:"Four years in industry: data load frameworks, pipeline migrations, Kafka services and data-quality tooling."},
  {id:"phase-ai", lane:"arc", title:"AI agents and data science", sub:"M.S. year one", start:"2025-08", end:"2026-08", group:true,
   desc:"Back to school at SJSU. RAG systems, multi-agent backends, streaming pipelines, then production AI at MedLaunch."},
  {id:"phase-gpu", lane:"arc", title:"GPU systems and ML compilers", sub:"Now → 2027", start:"2026-09", end:"2027-12", group:true,
   desc:"CUDA kernels, roofline models, vLLM on an NVIDIA GB10, and a PyTorch → ONNX → INT8 NPU compiler flow."},

  // ---------- EDUCATION ----------
  {id:"mumbai", lane:"edu", title:"B.E., Computer Engineering", sub:"Mumbai University", start:"2018-08", end:"2021-05",
   role:"Mumbai University · Aug 2018 – May 2021 · U.S. equivalent: B.S. Computer Science",
   desc:"Computer engineering degree in Mumbai. Most of my learning happened outside class: web pages first, then PHP and MySQL apps, then Java desktop apps.",
   story:["Built the first versions of a Stack Overflow clone, an ERP front end and a Java electricity-bill generator (now VoltWise).","Entered the Hubli Hackathon in my first semester (Aug 2018)."],
   tools:["HTML","CSS","JavaScript","PHP","MySQL","Java","Swing"],
   mermaid:`flowchart LR
  A["Static web pages<br/>2018–2019"] --> B["PHP + MySQL apps<br/>2020"]
  B --> C["Java desktop apps<br/>Employee mgmt, bill generator"]
  C --> D["Graduated<br/>May 2021"]
  D --> E["Joined Merkle<br/>Jul 2021"]`},
  {id:"sjsu", lane:"edu", title:"M.S., Data Intelligence (STEM)", sub:"San José State University", start:"2025-08", end:"2027-12", when:"Aug 2025 – Dec 2027 (expected)",
   role:"San José State University · Aug 2025 – Dec 2027 (expected)",
   desc:"Graduate program focused on data systems, machine learning and computing. Most of my 2026 projects started as coursework here and grew past the assignment.",
   story:["Coursework: Computer Architecture, Deep Learning, NLP, Algorithms, Software Engineering, Linear Algebra, Probability, Numerical Analysis.","Course projects became public repos: LinkedIn Simulation, AKI pipeline, GPT-from-scratch lab, GPU benchmarking."],
   tools:["Python","PyTorch","Spark","Kafka","CUDA","SQL"],
   mermaid:`flowchart LR
  DL["Deep Learning"] --> GPT["GPT-from-scratch lab"]
  DL --> NPU["edge-vision-npu"]
  CA["Computer Architecture"] --> GPU["GPU benchmarking"]
  DS["Distributed systems"] --> LI["LinkedIn Simulation"]
  BD["Data pipelines"] --> AKI["AKI pipeline"]
  BD --> CR["Crypto pipeline"]`},

  // ---------- EXPERIENCE ----------
  {id:"merkle", lane:"exp", title:"Merkle (Dentsu Group)", sub:"Software Engineer I → II", start:"2021-07", end:"2025-07",
   role:"Software Engineer · Mumbai · Jul 2021 – Jul 2025 (Software Engineer II from Jun 2023)",
   desc:"Four years building data platforms and backend services for enterprise clients: load frameworks, pipeline migrations and the data-quality tooling that keeps nightly jobs from paging anyone.",
   story:[
     "Built a reusable Data Load Framework that consolidated client configs across AWS, GCP, Azure, SQL Server and Snowflake. <span class=num>80%</span> of clients adopted it.",
     "Migrated <span class=num>38</span> Informatica pipelines to SQL Server stored procedures scheduled in Tidal, cutting cost <span class=num>21.33%</span> and runtime <span class=num>18%</span> at <span class=num>25M</span> rows a day.",
     "Reclaimed <span class=num>2 TB</span> a month and took Redshift incidents from <span class=num>7</span> to <span class=num>0</span> across <span class=num>80+</span> daily pipelines with an automated purge and data-quality framework.",
     "Received the Climb High Award for platform efficiency work and code reviews."],
   tools:["Java","Python","SQL","Spring Boot","Kafka","SQL Server","Snowflake","Redshift","AWS","GCP","Azure","Kubernetes"],
   mermaid:`flowchart LR
  SRC["Client sources<br/>AWS · GCP · Azure · SQL Server"] --> DLF["Data Load Framework<br/>shared client configs"]
  DLF --> SF[("Snowflake")]
  INF["38 Informatica pipelines"] --> SP["SQL Server procedures<br/>scheduled in Tidal"]
  SP --> SF
  RS[("Redshift · 80+ daily pipelines")] --> PG["Purge + data-quality<br/>framework"]
  PG --> OK["Incidents 7 → 0<br/>2 TB / month reclaimed"]`,
   links:[]},
  {id:"isa", lane:"exp", title:"Instructional Student Assistant", sub:"SJSU · Data Systems Core", start:"2026-01", end:"2026-05",
   role:"San José State University · Jan 2026 – May 2026",
   desc:"Teaching assistant for a graduate data systems course. Explaining concurrency to 30 people is a good test of whether you really understand it.",
   story:["Taught <span class=num>30+</span> graduate students process scheduling, deadlock prevention, concurrent data structures and distributed systems.","Ran mentoring sessions on Kafka architecture and wrote lab guides."],
   tools:["Kafka","Linux","Python","Distributed systems"],
   mermaid:`flowchart LR
  OS["Process scheduling"] --> DL["Deadlock prevention"]
  DL --> CDS["Concurrent data structures"]
  CDS --> DS["Distributed systems"]
  DS --> K["Kafka labs"]`},
  {id:"medlaunch", lane:"exp", title:"MedLaunch Concepts", sub:"Software Engineer Intern – Data/AI", start:"2026-06", end:"2026-08",
   role:"Software Engineer Intern – Data/AI · Jun 2026 – Aug 2026",
   desc:"Summer internship at a healthcare accreditation company. I worked on LLM search over hospital policies and on the AWS pipelines that feed it.",
   story:[
     "Built Clara, a RAG application over <span class=num>50K+</span> policy documents tuned against an evaluation set. It cut policy-lookup effort by <span class=num>60%</span>.",
     "Traced slow requests to Lambda cold starts with CloudWatch and cut latency from <span class=num>4–8s</span> to <span class=num>1.5–2.5s</span> with request pre-warming.",
     "Built an identity-resolution pipeline across <span class=num>5</span> Lambda services (SQS, EventBridge) and ran a <span class=num>22K</span>-policy backfill with zero hard failures.",
     "Loaded medical dictionaries into MongoDB Atlas with AWS Glue for query expansion, cutting unmatched-query latency by <span class=num>400–550ms</span>.",
     "Kept search analytics private with keyed-HMAC hashing and PHI-stripping allowlists, and moved credentials into Secrets Manager."],
   tools:["Python","Flask","AWS Lambda","SQS","EventBridge","Step Functions","AWS Glue","S3","CloudWatch","MongoDB Atlas","Secrets Manager","PyTest","RAG"],
   mermaid:`flowchart LR
  subgraph SEARCH["Policy search"]
    Q["Staff question"] --> CL["Clara RAG<br/>50K+ docs"]
    CL --> QE["Query expansion"]
    QE --> MDB[("MongoDB Atlas")]
    CL --> PRIV["HMAC hashing<br/>PHI allowlist"]
  end
  subgraph PIPE["Report pipeline"]
    S3["Survey reports · S3"] --> EB["EventBridge + SQS"]
    EB --> L["5 Lambda services<br/>identity resolution"]
    L --> MDB
  end
  GLUE["Glue ETL<br/>medical dictionaries"] --> MDB`},

  // ---------- PROJECTS ----------
  {id:"early-web", lane:"proj", title:"Early web apps", sub:"PHP · Java · HTML", start:"2018-07", end:"2020-08",
   role:"Personal projects · 2018 – 2020 (archived)",
   desc:"The apps I learned on: a Stack Overflow clone, an ERP front end, a company profile site, a Fruit Ninja browser game and a Java employee-management system.",
   story:["Learned server-side PHP, MySQL schemas and Java desktop UI by building whole apps, not exercises."],
   tools:["HTML","CSS","JavaScript","PHP","MySQL","Java"],
   links:[["Stackoverflow clone",GH("Stackoverflow")],["ON-VESH",GH("ON-VESH")],["Quick-ERP",GH("Quick-ERP")],["Fruit-Ninja-Game",GH("Fruit-Ninja-Game")],["Employee-Management-System",GH("Employee-Management-System")]]},
  {id:"voltwise", lane:"proj", title:"VoltWise", sub:"Java · billing + battery analytics", start:"2020-07", end:"2020-09", revisit:"2026-10",
   role:"Started 2020 as a bill generator · extended in Oct 2026",
   desc:"Started as a Swing + MySQL electricity-bill generator in 2020. In 2026 I turned it into an analytics engine that asks whether a home battery pays for itself on a time-of-use tariff with a demand charge.",
   story:[
     "Runs on <span class=num>2,075,259</span> one-minute household meter readings and a year of ISO New England hourly prices.",
     "The deployable controller cuts peak demand <span class=num>53.1%</span> and the annual bill <span class=num>17.1%</span> (<span class=num>$422.94</span>). That captures 84% of the perfect-foresight LP optimum.",
     "Meter anomaly detection: <span class=num>96.3%</span> event recall at <span class=num>99.97%</span> precision on 600 injected faults. Covered by <span class=num>29</span> JUnit tests."],
   tools:["Java","MySQL","Swing","Linear programming","Gradient boosting","JUnit"],
   mermaid:`flowchart LR
  M["2M meter readings"] --> AN["Anomaly detection"]
  P["ISO-NE hourly prices"] --> TOU["Time-of-use tariff"]
  AN --> LOAD["Load analysis + forecast"]
  LOAD --> DISP["Battery dispatch<br/>rules vs LP optimum"]
  TOU --> DISP
  DISP --> BILL["Bill + payback<br/>17.1% saved"]`,
   links:[["VoltWise",GH("VoltWise")]]},
  {id:"first-analytics", lane:"proj", title:"First-semester analytics", sub:"Alteryx · Jupyter", start:"2025-10", end:"2025-12",
   role:"SJSU coursework · Oct – Dec 2025",
   desc:"Two analysis projects from my first M.S. semester: an Alteryx workflow that extracts, transforms and visualizes crime data, and a statistical study of sleep, stress and academic performance across 2,000 universities.",
   tools:["Alteryx","Python","pandas","Statistics"],
   links:[["Crime-Data-Analysis",GH("Crime-Data-Analysis")],["Sleep, stress and academic performance",GH("Analyzing-Relationship-Between-Sleep-Stress-and-Academic-Performance")]]},
  {id:"multiagent", lane:"proj", title:"Multiagent-LangGraph", sub:"LangGraph · FAISS · K8s", start:"2026-02", end:"2026-04",
   role:"Personal project · Feb – Apr 2026",
   desc:"A multi-agent RAG backend with LangGraph and FastAPI over a local FAISS vector store, with schema contracts and guardrails between agents.",
   story:["Wrote Kubernetes manifests for it: a 2-replica Deployment with resource limits, secrets and a persistent volume for the FAISS index."],
   tools:["Python","LangGraph","FastAPI","FAISS","Kubernetes","Docker"],
   mermaid:`flowchart LR
  U["Client"] --> API["FastAPI"]
  API --> G["LangGraph<br/>agent graph"]
  G --> R["Retriever agent"] --> F[("FAISS")]
  G --> W["Writer agent"]
  W --> GR["Guardrails +<br/>schema contracts"] --> API`,
   links:[["Multiagent-LanghGraph",GH("Multiagent-LanghGraph")]]},
  {id:"bookstack", lane:"proj", title:"bookstack-mcp", sub:"RAG · MCP server", start:"2026-03", end:"2026-04",
   role:"Personal project · Mar – Apr 2026",
   desc:"A library app with a RAG backend. A LangGraph pipeline answers questions over the catalog, streams answers over SSE, and exposes the knowledge base to other AI agents through an MCP server.",
   tools:["Python","FastAPI","LangGraph","pgvector","PostgreSQL","MCP","SSE"],
   mermaid:`flowchart LR
  UI["Web client"] -->|"SSE"| API["FastAPI"]
  AG["External AI agent"] -->|"MCP"| MCP["MCP server"]
  API --> LG["LangGraph pipeline"]
  MCP --> LG
  LG --> GD["Guardrails"]
  LG --> PG[("pgvector")]`,
   links:[["bookstack-mcp",GH("bookstack-mcp")]]},
  {id:"crypto", lane:"proj", title:"Realtime crypto pipeline", sub:"Kafka · Spark Streaming", start:"2026-03", end:"2026-04",
   role:"Course project with a teammate · Mar – Apr 2026",
   desc:"A streaming pipeline for live crypto prices: a Kafka producer, Spark Structured Streaming for processing, Hive for storage and a Kibana dashboard on Elasticsearch.",
   tools:["Python","Kafka","Spark Structured Streaming","Hive","Elasticsearch","Kibana"],
   mermaid:`flowchart LR
  EX["Exchange price API"] --> P["Kafka producer"]
  P --> K[("Kafka topic")]
  K --> SS["Spark Structured Streaming"]
  SS --> H[("Hive")]
  SS --> ES[("Elasticsearch")] --> KB["Kibana dashboard"]`,
   links:[["realtime-crypto-pipeline",GH("realtime-crypto-pipeline")]]},
  {id:"linkedin", lane:"proj", title:"LinkedIn Simulation", sub:"8 microservices · LLM agents", start:"2026-04", end:"2026-05",
   role:"Distributed systems course project · Apr – May 2026",
   desc:"A distributed LinkedIn clone: 8 FastAPI microservices talking over Kafka, Redis caching on ElastiCache, MySQL and MongoDB, a React front end, and LLM agents that act as a recruiter and a career coach.",
   tools:["Python","FastAPI","Kafka","Redis","ElastiCache","MySQL","MongoDB","React","AWS","Gemini 2.5 Flash"],
   mermaid:`flowchart LR
  UI["React app"] --> SVC["8 FastAPI services"]
  SVC <-->|"async events"| K[("Kafka")]
  SVC --> R[("Redis · ElastiCache")]
  SVC --> DB[("MySQL + MongoDB")]
  SVC --> AI["AI orchestrator"]
  AI --> LLM["Gemini 2.5 Flash<br/>recruiter + coach agents"]`,
   links:[["Linkedin_Simulation_LLM_Agent_Microservices",GH("Linkedin_Simulation_LLM_Agent_Microservices")]]},
  {id:"aki", lane:"proj", title:"AKI Trajectory Analysis", sub:"MIMIC-IV · Snowflake · Kafka", start:"2026-04", end:"2026-05",
   role:"Big data course project (group) · I owned batch ingestion and the bronze/silver layers",
   desc:"An end-to-end pipeline on MIMIC-IV ICU data that stages acute kidney injury with KDIGO rules and scores patients' risk in real time.",
   story:["My module: raw ingestion into Snowflake with COPY INTO, then cleaned and validated patient timelines with dbt and Great Expectations.","Downstream, the team added Spark features, MLflow models, a Kafka + Spark streaming scorer and a dashboard."],
   tools:["Python","Snowflake","dbt","Great Expectations","Spark","Kafka","MLflow"],
   mermaid:`flowchart LR
  CSV["MIMIC-IV CSVs"] --> BR["Bronze · Snowflake<br/>COPY INTO"]
  BR --> SV["Silver · dbt + GX<br/>validated timelines"]
  SV --> GD["Gold · Spark<br/>KDIGO stages + features"]
  GD --> MT["Mart · MLflow models"]
  MT --> RT["Real time · Kafka + Spark"]
  RT --> DSH["Dashboard"]
  classDef mine stroke-width:3px
  class BR,SV mine`,
   links:[["AKI_trajectory_Analysis",GH("AKI_trajectory_Analysis")]]},
  {id:"mlpipeline", lane:"proj", title:"MedLaunch take-home", sub:"Athena · boto3 · CloudFormation", start:"2026-05", end:null,
   role:"Interview take-home for MedLaunch · May 2026",
   desc:"The pipeline I built as the MedLaunch interview take-home. It flags healthcare facilities whose accreditation expires within six months.",
   story:["Stage 1 runs Athena SQL over raw S3 JSON through the Glue Data Catalog. Stage 2 filters with Python/boto3 and writes an audit log for every run.","Least-privilege IAM role scoped to three buckets, all deployed with CloudFormation."],
   tools:["Python","boto3","Amazon Athena","AWS Glue","S3","IAM","CloudFormation"],
   mermaid:`flowchart LR
  RAW[("S3 raw JSON")] --> GC["Glue Data Catalog"]
  GC --> ATH["Athena SQL<br/>stage 1"]
  RAW --> PY["Python boto3 filter<br/>expiring in 180 days"]
  PY --> OUT[("S3 filtered")]
  PY --> LOG[("Run audit log")]`,
   links:[["Medlaunch-pipeline",GH("Medlaunch-pipeline")]]},
  {id:"pneumonia", lane:"proj", title:"Pneumonia detector", sub:"TensorFlow · transfer learning", start:"2026-08", end:null,
   role:"Deep learning project · 2026",
   desc:"A chest X-ray pneumonia classifier that compares VGG16, VGG19 and ResNet50 transfer learning, packaged in a PyQt5 desktop app.",
   story:["Best validation accuracy: <span class=num>91.4%</span>."],
   tools:["Python","TensorFlow","Keras","PyQt5"],
   links:[["deep-learning-pneumonia-detector",GH("deep-learning-pneumonia-detector")]]},
  {id:"gptlab", lane:"proj", title:"GPT from scratch", sub:"PyTorch · RTX 5090", start:"2026-09", end:"2026-10",
   role:"DATA 266 lab · two-person comparative study · Sep – Oct 2026",
   desc:"Trained a small GPT from scratch, built a Yelp sentiment classifier, and ran CycleGAN style transfer.",
   story:["The GPT has <span class=num>1.65M</span> parameters and reached perplexity <span class=num>2.33</span>, trained on an RTX 5090."],
   tools:["Python","PyTorch","Transformers","CycleGAN","RTX 5090"],
   mermaid:`flowchart LR
  TXT["Text corpus"] --> TOK["Tokenizer"] --> GPT["GPT · 1.65M params"]
  GPT --> PPL["Perplexity 2.33"]
  Y["Yelp reviews"] --> CLS["Sentiment classifier"]
  IMG["Images"] --> CG["CycleGAN style transfer"]`,
   links:[["llm-sentiment-cyclegan-lab",GH("llm-sentiment-cyclegan-lab")]]},
  {id:"crewquarters", lane:"proj", title:"CrewQuarters", sub:"vLLM · NVIDIA GB10", start:"2026-09", end:"2026-10",
   role:"Hackathon project I led · Sep 2026, with my own follow-up work in Oct",
   desc:"A self-hosted AI-agent platform for NVIDIA GB10 / DGX Spark machines. It serves open-weight LLMs with vLLM, runs agents in sandboxed Docker containers, and ships as an offline .deb for air-gapped installs.",
   story:[
     "A GPU resource manager admits a model only if free memory and the KV-cache budget allow, and unloads it when idle.",
     "Agents never see raw secrets. They get narrow HS256 capability tokens through a broker, and secrets sit in an AES-256-GCM envelope-encrypted store.",
     "I added an Intruder Watch agent and measured it on the GB10: <span class=num>2.6–2.9s</span> answers using about <span class=num>19 GB</span> of memory."],
   tools:["Python","vLLM","CUDA","Docker","PostgreSQL","pgvector","nginx","FastAPI"],
   mermaid:`flowchart LR
  UI["Web UI"] --> NX["nginx TLS proxy"]
  NX --> API["Control API + scheduler"]
  API --> GRM["GPU resource manager<br/>memory + KV budget"]
  GRM --> V["vLLM · open-weight LLMs<br/>NVIDIA GB10"]
  API --> RT["Runtime daemon"]
  RT --> AG["Agent containers<br/>internal network"]
  AG --> BR["Capability broker<br/>scoped tokens"]
  BR --> KN["Knowledge service<br/>pgvector RAG"]
  BR --> SS["Secret store<br/>AES-256-GCM"]
  AG --> V`,
   links:[["crewquarters",GH("crewquarters")]]},
  {id:"gpubench", lane:"proj", title:"GPU Performance Benchmarking", sub:"CUDA C · roofline", start:"2026-10", end:null,
   role:"Personal project from DATA 266 work · Oct 2026",
   desc:"A CUDA C matrix-multiply kernel profiled with nvprof on a Tesla T4, plus an RTX 5090 study covering a roofline model, FP32 → FP8 GEMM throughput, and fused vs. naive attention.",
   story:[
     "The kernel uses a 2D grid of 16×16 thread blocks. Timed separately from H2D/D2H copies, it runs <span class=num>1,527×</span> faster than a CPU loop at N = <span class=num>4096</span>.",
     "RTX 5090 roofline ridge point: <span class=num>58.5</span> FLOPs/byte. GEMMs scale from <span class=num>64</span> to <span class=num>448</span> TFLOPS going from FP32 to FP8.",
     "Fused attention is <span class=num>7.2×</span> faster than naive attention. Naive attention runs out of memory at <span class=num>22,438</span> tokens."],
   tools:["CUDA C","nvprof","PyTorch","FP8","BF16","Tesla T4","RTX 5090"],
   mermaid:`flowchart LR
  subgraph T4["Tesla T4 · CUDA C"]
    H["Host matrices"] -->|"H2D"| K["matmul kernel<br/>16x16 blocks"]
    K -->|"D2H"| R["Result"]
    K --> NV["nvprof timing<br/>1,527x vs CPU"]
  end
  subgraph R5["RTX 5090 · PyTorch"]
    G["GEMM FP32 → FP8"] --> RF["Roofline<br/>ridge 58.5"]
    AT["Naive vs fused attention"] --> RF
  end`,
   links:[["gpu-performance-benchmarking",GH("gpu-performance-benchmarking")]]},
  {id:"edgenpu", lane:"proj", title:"edge-vision-npu", sub:"PyTorch → ONNX → INT8", start:"2026-10", end:"2026-12", when:"Oct 2026 – in progress",
   role:"Personal project · Oct 2026 – in progress",
   desc:"Vision models trained from scratch in PyTorch (ImageNet-20 classification and image restoration), exported to ONNX and compiled to INT8 for a Mobilint NPU with the Qubee compiler.",
   story:[
     "Compared <span class=num>3</span> image-restoration architectures (<span class=num>1.22M–4.85M</span> parameters) at the same training budget, measuring PSNR against runtime.",
     "ONNX Runtime output matches PyTorch at <span class=num>26.07 dB</span> PSNR. Automated tests check operator correctness and precision at each step.",
     "Next: INT8 latency and accuracy on the NPU itself."],
   tools:["Python","PyTorch","ONNX","ONNX Runtime","INT8 quantization","Qubee","Mobilint NPU"],
   mermaid:`flowchart LR
  D["ImageNet-20 + restoration data"] --> T["PyTorch training<br/>from scratch"]
  T --> O["ONNX export"]
  O --> C["ONNX Runtime check<br/>26.07 dB = PyTorch"]
  C --> Q["Qubee compiler<br/>INT8"]
  Q --> N["Mobilint NPU"]`,
   links:[["edge-vision-npu",GH("edge-vision-npu")]]},

  // ---------- ACHIEVEMENTS ----------
  {id:"hubli", lane:"ach", title:"Hubli Hackathon", sub:"First hackathon", start:"2018-08", end:null,
   role:"Hackathon · Aug 2018",
   desc:"My first hackathon, in my first semester of engineering.",
   tools:["HTML","CSS"], links:[["HUBLI-HACKATHON",GH("HUBLI-HACKATHON")]]},
  {id:"studylink", lane:"ach", title:"1st Prize · Study Link", sub:"Hackathon · team of 4", start:"2019-12", end:null, when:"During the B.E. (Mumbai)",
   role:"Hackathon · during the B.E. at Mumbai University",
   desc:"Won first prize. I led a team of 4 from problem definition to a shipped prototype in 12 hours.",
   story:["Team of <span class=num>4</span>, <span class=num>12</span> hours, first prize."]},
  {id:"climbhigh", lane:"ach", title:"Climb High Award", sub:"Merkle", start:"2023-06", end:null, when:"At Merkle, around the move to Software Engineer II",
   role:"Merkle (Dentsu Group) · around the move to Software Engineer II (Jun 2023)",
   desc:"Awarded for cloud infrastructure refactoring, system performance work and peer code reviews."},
  {id:"snowpro", lane:"ach", title:"SnowPro Core", sub:"Snowflake certification", start:"2022-09", end:null, when:"Merkle years",
   role:"Snowflake certification",
   desc:"Certified in Snowflake cloud architecture, data warehousing and data governance.",
   tools:["Snowflake"], links:[["Credential","https://achieve.snowflake.com/4d9320ea-6b52-4d88-afc7-125bd9a4cecf"]]},
  {id:"ascend", lane:"ach", title:"Agentic Data Bootcamp", sub:"Ascend.io", start:"2025-08", end:null, when:"Start of the M.S. at SJSU",
   role:"Certificate of completion · around the start of the M.S.",
   desc:"Agentic data engineering and analytics labs.",
   links:[["Credential","https://credsverse.com/credentials/a20683ee-1502-4b68-b900-881fea2c7711?preview=1"]]},
  {id:"deletedb", lane:"ach", title:"DeleteDB Hackathon", sub:"Built CrewQuarters", start:"2026-09", end:null,
   role:"Hackathon · Sep 24–25, 2026",
   desc:"Built CrewQuarters, an AI-agent platform for NVIDIA GB10 machines, in two days."},
  {id:"msgrad", lane:"ach", title:"M.S. graduation", sub:"SJSU · M.S. Data Intelligence", start:"2027-12", end:null, planned:true,
   role:"San José State University · expected Dec 2027",
   desc:"Expected completion of the M.S. in Data Intelligence."},
];

// "Built on → leads to" links drawn as wires on the HLD.
const EDGES = [
  ["mumbai","merkle"],["early-web","voltwise"],["merkle","sjsu"],["sjsu","isa"],
  ["mlpipeline","medlaunch"],["bookstack","medlaunch"],["crewquarters","deletedb"],["gptlab","gpubench"],["sjsu","first-analytics"]
];

// Projects are ordered by engineering level, not by date. Real dates stay in each panel.
const LEVELS = [
  {n:4, name:"Systems · GPU"},
  {n:3, name:"Distributed data"},
  {n:2, name:"Applied AI · cloud"},
  {n:1, name:"Foundation"},
];
const LEVEL = {"edgenpu":4,"gpubench":4,"crewquarters":4,"gptlab":4,
  "linkedin":3,"aki":3,"crypto":3,
  "multiagent":2,"bookstack":2,"mlpipeline":2,"pneumonia":2,"voltwise":2,
  "first-analytics":1,"early-web":1};
const YEARS = [2018,2019,2020,2021,2022,2023,2024,2025,2026,2027];
// Busy years get more width so the 2026 projects stay readable.
const WEIGHT = {2018:1.1,2019:.75,2020:1.05,2021:.9,2022:.75,2023:.8,2024:.75,2025:1.2,2026:4.6,2027:1.5};
const YEAR_THEME = {
  2018:"Started engineering; first web pages and first hackathon.",
  2019:"Static sites and company profile pages.",
  2020:"PHP and Java apps, including the bill generator that became VoltWise.",
  2021:"Graduated in May. Joined Merkle in July.",
  2022:"Data load frameworks and feature pipelines at Merkle.",
  2023:"Software Engineer II. Kafka services and data-quality tooling.",
  2024:"Data platform work at Merkle.",
  2025:"Left Merkle in July. Started the M.S. at SJSU in August.",
  2026:"Teaching assistant, MedLaunch internship, and the move into GPUs and ML compilers.",
  2027:"Finishing the M.S.; graduation in December."
};
const YEAR_TITLE = {2018:"Hello, web",2019:"Building sites",2020:"First real apps",2021:"Into industry",2022:"Data platforms",2023:"Latency matters",2024:"Scale",2025:"Back to school",2026:"AI and GPUs",2027:"Graduation"};

const byId = Object.fromEntries(ITEMS.map(i=>[i.id,i]));
const ym = s => { const [y,m]=s.split("-").map(Number); return {y,m}; };
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = s => { const {y,m}=ym(s); return MONTHS[m-1]+" "+y; };
const range = it => it.tbc ? "Date to confirm" : it.when || (it.end ? fmt(it.start)+" – "+fmt(it.end) : fmt(it.start));
const laneOf = id => LANES.find(l=>l.id===id);

const canvas = document.getElementById("canvas");
const scroller = document.getElementById("scroller");
// Vertical layout: years run top to bottom; lanes are columns.
const AXIS_W = 108, HEAD_H = 44, UNIT = 132, MIN_H = 66, GAP = 8, TOP_PAD = 16;

function geometry(){
  const W = Math.max(scroller.clientWidth, 900);
  const tw = LANES.reduce((a,l)=>a+l.w,0); const laneX={}, laneW={}; let lx=AXIS_W;
  LANES.forEach(l=>{ laneW[l.id]=(W-AXIS_W)*l.w/tw; laneX[l.id]=lx; lx+=laneW[l.id]; });
  const yy = {}; let acc = HEAD_H + TOP_PAD;
  [...YEARS].reverse().forEach(y=>{ yy[y]={y:acc,h:UNIT*WEIGHT[y]}; acc+=yy[y].h; });
  const y = (s, endOfMonth) => { const {y:Y,m}=ym(s); const R=yy[Y]; return R.y + R.h*(1-(m-1+(endOfMonth?1:0))/12); };
  return {W,laneW,laneX,yy,y,H:acc+TOP_PAD};
}

let G;
function render(){
  G = geometry();
  canvas.innerHTML = "";
  canvas.style.width = G.W+"px";
  canvas.style.height = G.H+"px";
  // lane headers
  const head=document.createElement("div"); head.className="vhead"; head.style.height=HEAD_H+"px";
  head.innerHTML=`<span class="vaxis-h" style="width:${AXIS_W}px">Year</span>`+LANES.map(L=>`<span class="lanelabel" style="--lc:var(${L.color});width:${G.laneW[L.id]}px"><i></i>${L.id==="arc"?"Focus":L.name+" <em>"+ITEMS.filter(i=>i.lane===L.id).length+(L.id==="proj"?" · by level, not date":"")+"</em>"}</span>`).join("");
  canvas.appendChild(head);
  // year bands + clickable year labels
  [...YEARS].reverse().forEach((y,i)=>{
    const band=document.createElement("div"); band.className="yband"+(y===2026?" now":""); band.style.top=G.yy[y].y+"px"; band.style.height=G.yy[y].h+"px"; canvas.appendChild(band);
    const b=document.createElement("button"); b.className="year"+(y===2026?" now":""); b.style.top=G.yy[y].y+"px"; b.style.height=G.yy[y].h+"px"; b.style.width=AXIS_W+"px";
    b.innerHTML = `<span>${y}</span><small>${YEAR_TITLE[y]}</small>`;
    b.setAttribute("aria-label","Summary of "+y); b.onclick=()=>openYear(y); canvas.appendChild(b);
  });
  LANES.forEach((L,li)=>{ const d=document.createElement("div"); d.className="lanesep"; d.style.left=G.laneX[L.id]+"px"; canvas.appendChild(d); });

  const placed = {};
  LANES.forEach((L,li)=>{
    const spread = L.id==="proj";
    const x0 = G.laneX[L.id], items = ITEMS.filter(i=>i.lane===L.id).sort((a,b)=> spread ? ((LEVEL[b.id]-LEVEL[a.id]) || (b.end||b.start).localeCompare(a.end||a.start)) : (b.end||b.start).localeCompare(a.end||a.start));
    const RAIL = spread ? 30 : 0, LGAP = 22;
    let slot = 0, top0 = HEAD_H + TOP_PAD;
    if (spread) slot = (G.H - TOP_PAD - top0 - LGAP*(LEVELS.length-1)) / items.length;
    // assign sub-columns for overlaps (non-spread lanes)
    const cols = []; const geo = {};
    items.forEach((it,idx)=>{
      let t,b;
      if (spread) {
        const gi = LEVELS.findIndex(l=>l.n===LEVEL[it.id]);
        t = top0 + idx*slot + gi*LGAP + 3; b = t + Math.max(MIN_H, slot-6);
        geo[it.id]={t,b,col:0};
      } else {
        b = G.y(it.start,false); t = it.end ? G.y(it.end,true) : b - MIN_H;
        if (b-t < MIN_H) t = b - MIN_H; if (t < HEAD_H+TOP_PAD) { const d=HEAD_H+TOP_PAD-t; t+=d; b+=d; }
        let col = cols.findIndex(e=>e <= t+1); if(col<0){col=cols.length; cols.push(0);} cols[col]=b;
        geo[it.id]={t,b,col};
      }
    });
    const ncol = spread ? 1 : Math.max(1,cols.length);
    const innerL = x0 + 10 + RAIL, innerW = G.laneW[L.id] - 20 - RAIL, cw = (innerW - (ncol-1)*GAP)/ncol;
    items.forEach(it=>{
      const g=geo[it.id], l=innerL + g.col*(cw+GAP), r=l+cw;
      const b=document.createElement("button");
      const hasPort=!!(it.links&&it.links.length);
      b.className="blk"+(it.group?" phase":"")+(it.planned?" planned":"")+(it.tbc?" tbc":"")+(!it.group&&(g.b-g.t)>170?" tall":"")+(hasPort?" has-port":"");
      b.dataset.id=it.id; b.style.setProperty("--lc",`var(${L.color})`);
      b.style.left=l+"px"; b.style.width=cw+"px"; b.style.top=g.t+"px"; b.style.height=(g.b-g.t-GAP)+"px";
      b.innerHTML=`<b><em>${it.title}</em></b><span>${it.sub||""}</span>`+(hasPort?`<i class="port" title="Has links"></i>`:"");
      b.setAttribute("aria-label",`${it.title}, ${range(it)}. Open details`);
      b.onclick=()=> it.group ? openPhase(it) : openItem(it.id);
      b.onmouseenter=()=>highlight(it.id); b.onmouseleave=()=>highlight(null);
      b.onfocus=()=>highlight(it.id); b.onblur=()=>highlight(null);
      canvas.appendChild(b);
      placed[it.id]={l,r,t:g.t,b:g.b-GAP};
    });
    if (spread) LEVELS.forEach(lv=>{
      const g = items.filter(i=>LEVEL[i.id]===lv.n); if(!g.length) return;
      const t = Math.min(...g.map(i=>placed[i.id].t)), bt = Math.max(...g.map(i=>placed[i.id].b));
      const d=document.createElement("div"); d.className="lvl"; d.dataset.lvl=lv.n;
      d.style.left=(x0+8)+"px"; d.style.width=(RAIL-6)+"px"; d.style.top=t+"px"; d.style.height=(bt-t)+"px";
      d.innerHTML=`<span>L${lv.n} · ${lv.name}</span>`; canvas.appendChild(d);
    });
  });

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg"); svg.classList.add("wires");
  svg.setAttribute("width",G.W); svg.setAttribute("height",G.H);
  svg.innerHTML='<defs><marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z"/></marker></defs>';
  EDGES.forEach(([a,b])=>{
    const A=placed[a],B=placed[b]; if(!A||!B) return;
    let d, ex, ey;
    if (A.t >= B.b - 4) {
      const x1=(A.l+A.r)/2, y1=A.t, x2=(B.l+B.r)/2, y2=B.b, dy=Math.max(24,(y1-y2)/2);
      d=`M${x1},${y1} C${x1},${y1-dy} ${x2},${y2+dy} ${x2},${y2}`; ex=x2; ey=y2;
    } else if (B.t >= A.b - 4) {
      const x1=(A.l+A.r)/2, y1=A.b, x2=(B.l+B.r)/2, y2=B.t, dy=Math.max(24,(y2-y1)/2);
      d=`M${x1},${y1} C${x1},${y1+dy} ${x2},${y2-dy} ${x2},${y2}`; ex=x2; ey=y2;
    } else {
      const right = B.l >= A.r; const x1 = right?A.r:A.l, x2 = right?B.l:B.r;
      const y1=(A.t+A.b)/2, y2=(B.t+B.b)/2, dx=Math.max(20,Math.abs(x2-x1)/2)*(right?1:-1);
      d=`M${x1},${y1} C${x1+dx},${y1} ${x2-dx},${y2} ${x2},${y2}`; ex=x2; ey=y2;
    }
    const p=document.createElementNS(svg.namespaceURI,"path"); p.setAttribute("d",d); p.setAttribute("marker-end","url(#arw)"); p.dataset.a=a; p.dataset.b=b; svg.appendChild(p);
  });
  canvas.appendChild(svg);
  document.getElementById("count").textContent = `${ITEMS.filter(i=>!i.group).length} components · ${YEARS.length} years`;
}

function neighbors(id){ return EDGES.filter(e=>e.includes(id)).map(e=>e[0]===id?e[1]:e[0]); }
function highlight(id){
  const near = id ? new Set([id,...neighbors(id)]) : null;
  canvas.querySelectorAll(".blk").forEach(b=>{ b.classList.toggle("lit", !!near && near.has(b.dataset.id) && b.dataset.id!==id); });
  canvas.querySelectorAll("svg.wires > path:not(.leader)").forEach(p=>p.classList.toggle("lit", !!id && (p.dataset.a===id||p.dataset.b===id)));
  canvas.querySelectorAll(".lvl").forEach(p=>p.classList.toggle("on", !!id && LEVEL[id]===+p.dataset.lvl));
}

function activeIn(it,y){ const s=ym(it.start).y; const e=it.end?ym(it.end).y:s; return !it.tbc && s<=y && y<=e; }
function strip(){
  const el=document.getElementById("strip"); el.innerHTML="";
  [...YEARS].reverse().forEach(y=>{
    const items=ITEMS.filter(i=>!i.group&&activeIn(i,y));
    const card=document.createElement("button"); card.className="ycard"+(y===2026?" now":"");
    const bars = LANES.filter(l=>l.id!=="arc").map(l=>{const n=items.filter(i=>i.lane===l.id).length; return n?`<i style="width:${n*14}px;background:var(${l.color})" title="${l.name}: ${n}"></i>`:"";}).join("");
    card.innerHTML=`<span class="yr">${y}</span><span class="th">${YEAR_TITLE[y]}</span><span class="ln">${YEAR_THEME[y]}</span><span class="bars">${bars}</span>`;
    card.onclick=()=>openYear(y); el.appendChild(card);
  });
}

// ---------- inline LLD panel ----------
const drawer=document.getElementById("drawer");
let openId=null;
function show(){ drawer.hidden=false; const r=drawer.getBoundingClientRect(); if(r.top<70||r.top>innerHeight*0.6) drawer.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}); }
function close(){ drawer.hidden=true; openId=null; try{ history.replaceState(null,"","#map"); }catch(e){} document.getElementById("canvas").scrollIntoView({block:"nearest"}); }
document.getElementById("dclose").onclick=close;
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!drawer.hidden) close(); });

function sec(title, html){ return `<div class="sec"><h3>${title}</h3>${html}</div>`; }
function setHead(lane, metaExtra, title, role){
  const L=laneOf(lane); drawer.style.setProperty("--lc",`var(${L.color})`);
  document.getElementById("dmeta").innerHTML=`<span class="chip" style="--lc:var(${L.color})">${lane==="arc"?"Focus":L.name} · ${lane==="arc"?"HLD":"LLD"}</span>${metaExtra}`;
  document.getElementById("dtitle").textContent=title;
  document.getElementById("drole").textContent=role||"";
}
function openItem(id){
  const it=byId[id]; if(!it) return; openId=id;
  const lv = LEVEL[id] ? LEVELS.find(l=>l.n===LEVEL[id]) : null;
  setHead(it.lane, `<span>${range(it)}</span>`+(lv?`<span>· Level ${lv.n}: ${lv.name}</span>`:""), it.title, it.role||it.sub);
  let h = sec("What it is", `<p>${it.desc}</p>`);
  if (it.story) h += sec("Story", `<ul class="story">${it.story.map(s=>`<li>${s}</li>`).join("")}</ul>`);
  if (it.mermaid) h += sec("Architecture", `<a class="diagram" href="assets/lld-${it.id}.svg" target="_blank" rel="noopener"><img src="assets/lld-${it.id}.svg" alt="Architecture diagram for ${it.title}" loading="lazy"></a>`);
  if (it.tools) h += sec("Tools", `<div class="tools">${it.tools.map(t=>`<span class="tool">${t}</span>`).join("")}</div>`);
  if (it.links && it.links.length) h += sec("Links", `<div class="links">${it.links.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">↗ ${t}</a>`).join("")}</div>`);
  const nb=neighbors(id);
  if (nb.length) h += sec("Connected", `<div class="related">${nb.map(n=>{const o=byId[n];return `<button class="rel" style="--lc:var(${laneOf(o.lane).color})" data-go="${n}">${o.title}</button>`;}).join("")}</div>`);
  if (it.tbc) h += `<p class="note" style="margin-top:16px">Placed on the timeline approximately. The exact year still needs confirming.</p>`;
  document.getElementById("dbody").innerHTML=h;
  wireRel(); show();
  try{ history.replaceState(null,"","#map/"+id); }catch(e){}
}
function groupList(items){
  return `<div class="grouplist">${items.map(o=>`<button class="gitem" style="--lc:var(${laneOf(o.lane).color})" data-go="${o.id}"><span class="d">${o.tbc?"TBC":fmt(o.start)}</span><b>${o.title}</b><span>${laneOf(o.lane).name} · ${o.sub||""}</span></button>`).join("")}</div>`;
}
function openPhase(p){
  openId=p.id;
  const s=p.start,e=p.end;
  const items=ITEMS.filter(i=>!i.group&&!i.tbc&&i.lane!=="arc"&&i.start<=e&&(i.end||i.start)>=s).sort((a,b)=>a.start.localeCompare(b.start));
  setHead("arc", `<span>${fmt(s)} – ${fmt(e)}</span>`, p.title, p.sub);
  document.getElementById("dbody").innerHTML = sec("Summary",`<p>${p.desc}</p>`) + sec(`Components in this phase · ${items.length}`, groupList(items));
  wireRel(); show();
}
function openYear(y){
  openId="y"+y;
  const items=ITEMS.filter(i=>!i.group&&activeIn(i,y)).sort((a,b)=>a.start.localeCompare(b.start));
  setHead("arc", `<span>Year view</span>`, `${y} · ${YEAR_TITLE[y]}`, YEAR_THEME[y]);
  document.getElementById("dbody").innerHTML = sec(`Active this year · ${items.length}`, items.length?groupList(items):`<p class="note">Nothing dated in this year yet.</p>`);
  wireRel(); show();
}
function wireRel(){ document.querySelectorAll("#dbody [data-go]").forEach(b=>b.onclick=()=>{ const it=byId[b.dataset.go]; it.group?openPhase(it):openItem(it.id); show(); }); }

// ---------- boot ----------
render(); strip();
let rt; addEventListener("resize",()=>{ clearTimeout(rt); rt=setTimeout(render,120); });
function fromHash(){ const h=(location.hash.match(/^#map\/(.+)$/)||[])[1]; if(h && byId[h]) { byId[h].group?openPhase(byId[h]):openItem(h); } }
fromHash(); addEventListener("hashchange",fromHash);
})();
