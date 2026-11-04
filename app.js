// All content lives here. Facts come from the public repos and the user-approved resume and career-map content.
const GH = r => "https://github.com/Nikhil-Khaneja/" + r;

const STATS = [
  {b:"1,527×", s:"CUDA C kernel vs CPU loop", m:"Tesla T4 · N=4096", c:"--gpu"},
  {b:"448 TFLOPS", s:"FP8 GEMM throughput", m:"RTX 5090", c:"--orange"},
  {b:"7.2×", s:"fused vs naive attention", m:"RTX 5090", c:"--teal"},
  {b:"50K+", s:"documents behind RAG search", m:"MedLaunch · Clara", c:"--exp"},
  {b:"4 yrs", s:"building data platforms", m:"Merkle (Dentsu)", c:"--edu"},
];

// Trade-offs: every number below is copied from the repo's own results files
// (docs/benchmarks, METRICS.md, RESULTS.md, compare.log, PERFORMANCE_ANALYSIS.md, README result tables).
// Row format: {m: metric, v: raw values (for bar length), f: display text, better: "low" | "high"}.
const PROJECTS = [
  {id:"crewquarters", title:"CrewQuarters", kind:"Systems · GPU", c:"--gpu", tag:"Led",
   when:"Sep 2026 hackathon, then my own follow-up work",
   lede:"A self-hosted AI-agent platform for NVIDIA GB10 / DGX Spark machines: vLLM model serving, sandboxed agent containers and cited RAG, installed offline from one .deb.",
   metrics:[["15.5 ms","to refuse a model that won't fit"],["26×","faster search with HNSW at 100K chunks"],["27.4 s","from empty machine to first agent run"],["2.6–2.9 s","Intruder Watch answers on GB10"]],
   tradeoffs:[
     {q:"Exact vector search, or an HNSW index?", chose:"Exact search for now, HNSW at ~100K chunks", cols:["Exact","HNSW"], pick:0,
      rows:[{m:"SQL p50 · 10K chunks", v:[23.2,21.8], f:["23.2 ms","21.8 ms"], better:"low"},
            {m:"Table size · 10K chunks", v:[87,113], f:["87 MB","113 MB"], better:"low"},
            {m:"SQL p50 · 100K chunks", v:[124.6,4.7], f:["124.6 ms","4.7 ms"], better:"low"},
            {m:"API p50 · 100K chunks", v:[302.7,30.6], f:["302.7 ms","30.6 ms"], better:"low"},
            {m:"Recall@8 vs exact · 100K", v:[1,0.994], f:["100%","99.4%"], better:"high"}],
      verdict:"At today's corpus size the index saves 1.4 ms and costs 30% more storage. At 100K chunks it is 26× faster at the database and 10× at the API, and still finds 99.4% of the exact top 8.",
      cost:"Exact search grows linearly with the corpus, so the index has to land before a knowledge base reaches about 100K chunks."},
     {q:"Refuse a model up front, or try to load it?", chose:"Admission control with a fixed memory budget", cols:["Refuse","Load attempt"], pick:0,
      rows:[{m:"Time to answer · p50", v:[15.5,2240], f:["15.5 ms","2.24 s"], better:"low"},
            {m:"Time to answer · p95", v:[22.3,2320], f:["22.3 ms","2.32 s"], better:"low"}],
      verdict:"A refusal answers 145× faster than even a successful cold start, and it never puts the other running agents at risk of an out-of-memory kill.",
      cost:"24 GiB system reserve plus an 8 GiB load margin is 32 GiB held back on a 128 GB machine. That is a quarter of memory that never serves a model."},
     {q:"Docker Compose, or Kubernetes (k3s)?", chose:"Compose for v1", facts:[
        ["24.7 s","whole stack up on a laptop"],["1.9 s","p50 from a new run to a running agent container"],
        ["5.6 s","p50 for the same step when 12 runs arrive at once"],["0","errors across 13 API routes at 1, 16 and 64 concurrent clients"]],
      verdict:"One owner-operated machine doesn't need a cluster scheduler. Compose gives a smaller installer and a 25-second laptop demo.",
      cost:"No pooling across machines and no high availability. A burst of 12 runs triples start-up latency, because they queue on one host."}],
   stack:["Python","vLLM","CUDA","Docker","PostgreSQL","pgvector","FastAPI","nginx"],
   mermaid:`flowchart LR
  UI["Web UI"] --> NX["nginx TLS proxy"]
  NX --> API["Control API<br/>+ scheduler"]
  API --> GRM["GPU resource manager<br/>memory + KV budget"]
  GRM --> V["vLLM<br/>open-weight LLMs"]
  API --> RT["Runtime daemon"]
  RT --> AG["Agent containers"]
  AG --> BR["Capability broker<br/>scoped tokens"]
  BR --> KN["Knowledge service<br/>pgvector RAG"]
  BR --> SS["Secret store<br/>AES-256-GCM"]
  AG --> V`,
   repo:"crewquarters"},

  {id:"gpu", title:"GPU Performance Benchmarking", kind:"Systems · GPU", c:"--orange",
   when:"Oct 2026",
   lede:"A hand-written CUDA C matmul on a Tesla T4, then a roofline, precision, attention and thermal study of an RTX 5090. The goal is knowing why the numbers come out the way they do.",
   metrics:[["1,527×","end to end vs CPU, N=4096"],["448 TFLOPS","FP8 GEMM, 7× FP32"],["152×","less memory, fused attention"],["97.6%","of peak after 20 minutes"]],
   tradeoffs:[
     {q:"When is it worth moving work to the GPU?", chose:"GPU from N=256 up, with copies counted", cols:["N=256","N=1024","N=4096"], pick:2,
      rows:[{m:"Kernel time", v:[0.23,7.90,319.19], f:["0.23 ms","7.90 ms","319 ms"], better:"none"},
            {m:"Host↔device copies", v:[0.39,4.82,76.15], f:["0.39 ms","4.82 ms","76.2 ms"], better:"none"},
            {m:"Copies as share of GPU time", v:[63,38,19], f:["63%","38%","19%"], better:"low"},
            {m:"End-to-end speedup vs CPU", v:[32,264,1527], f:["32×","264×","1,527×"], better:"high"}],
      verdict:"Copies are 63% of the GPU's time at N=256 but only 19% at N=4096. The bigger the problem, the more the fixed transfer cost is amortised.",
      cost:"Below a few dozen elements per side, launch overhead and about 0.4 ms of transfers make one CPU thread faster."},
     {q:"How much does dropping precision buy?", chose:"FP8 / BF16 for throughput-bound work", cols:["FP32","TF32","BF16","FP8"], pick:3,
      rows:[{m:"Best GEMM throughput (TFLOPS)", v:[64.3,108.2,229.0,448.0], f:["64.3","108.2","229.0","448.0"], better:"high"},
            {m:"At N=1024 (TFLOPS)", v:[41.4,71.9,94.3,182.8], f:["41.4","71.9","94.3","182.8"], better:"high"}],
      verdict:"FP8 is 7× FP32 and 2× BF16, which is the tensor-core rate doubling as the format halves.",
      cost:"Fewer bits per value, and FP8 needs scaled matmuls. Small GEMMs (N=1024) reach only 40–70% of peak in any format because they can't fill all 170 SMs."},
     {q:"Naive or fused attention?", chose:"Fused (FlashAttention-style)", cols:["Naive","Fused"], pick:1,
      rows:[{m:"Memory · 20,480 tokens", v:[27.02,0.178], f:["27.02 GB","0.178 GB"], better:"low"},
            {m:"Time · 20,480 tokens", v:[57.27,7.919], f:["57.3 ms","7.9 ms"], better:"low"},
            {m:"Time · 512 tokens", v:[0.046,0.024], f:["0.046 ms","0.024 ms"], better:"low"},
            {m:"Longest sequence before OOM", v:[22437,32768], f:["22,437","32,768+ (no OOM)"], better:"high"}],
      verdict:"The fused kernel never builds the seq×seq score matrix, so memory grows linearly and it is 7.2× faster at long sequences. Short sequences only gain 1.9×.",
      cost:"The backward pass recomputes tiles instead of storing them, spending extra FLOPs to save memory traffic. One lesson along the way: WSL2 silently spilled to host RAM and made one run 29× slower instead of failing, so I capped GPU memory to find the real limit."}],
   stack:["CUDA C","nvprof","PyTorch","FP8","BF16","Tesla T4","RTX 5090"],
   mermaid:`flowchart LR
  subgraph T4["Tesla T4 · CUDA C"]
    direction LR
    H["Host matrices"] -->|"H2D"| K["matmul kernel<br/>16x16 blocks"]
    K -->|"D2H"| R["Result vs CPU"]
    K --> NV["nvprof<br/>1,527x"]
  end
  subgraph R5["RTX 5090 · PyTorch"]
    direction LR
    G["GEMM FP32 to FP8"] --> RF["Roofline<br/>ridge 58.5"]
    AT["Naive vs fused attention"] --> RF
    TH["20-min sustained load"] --> RF
  end`,
   repo:"gpu-performance-benchmarking"},

  {id:"npu", title:"edge-vision-npu", kind:"Edge AI", c:"--edu",
   when:"Oct 2026 – in progress",
   lede:"Two vision models trained from scratch in PyTorch and compiled to INT8 for a Mobilint NPU: an ImageNet-20 classifier and an image-restoration network.",
   metrics:[["77.4%","ImageNet-20 top-1, no pretraining"],["+0.945 dB","restoration gain over the input"],["0.000 dB","ONNX vs PyTorch gap"],["2.66M","params, chosen from 3 designs"]],
   tradeoffs:[
     {q:"Which restoration architecture, at the same training budget?", chose:"DualScaleSR (dual)", cols:["plain","dual","unet"], pick:1,
      rows:[{m:"Parameters", v:[1.22,2.66,4.85], f:["1.22M","2.66M","4.85M"], better:"low"},
            {m:"Gain over input (25.121 dB)", v:[0.852,0.945,0.912], f:["+0.852 dB","+0.945 dB","+0.912 dB"], better:"high"},
            {m:"Training time, 3,000 steps", v:[44.0,55.1,61.9], f:["44.0 min","55.1 min","61.9 min"], better:"low"}],
      verdict:"dual gets 11% more improvement than plain. The U-Net has 1.8× its parameters and does worse, so more capacity wasn't the bottleneck.",
      cost:"dual trains 25% slower than plain and has 2.2× the parameters, which matters on an NPU with a fixed memory budget."},
     {q:"Use any operator, or only ones the NPU runs natively?", chose:"NPU-safe operators only", facts:[
        ["5","operator types: Conv, ReLU, Add, Concat, PixelShuffle"],["0","ops that fall back to the CPU"],
        ["25.121 dB","PSNR at step 0: the model starts as an exact identity"],["26.066 dB","ONNX Runtime = PyTorch"]],
      verdict:"The whole graph compiles to the NPU. Starting as an identity means training only learns the correction.",
      cost:"No BatchNorm, so stability comes from scaled residuals. The FP32 → INT8 accuracy gap on the NPU is not measured yet, and it is the next result."}],
   stack:["PyTorch","ONNX","ONNX Runtime","INT8","Qubee","Mobilint NPU"],
   mermaid:`flowchart LR
  D["ImageNet-20 +<br/>restoration pairs"] --> T["PyTorch training<br/>FP32"]
  T --> O["ONNX export<br/>opset 13"]
  O --> C["ONNX Runtime check<br/>matches PyTorch"]
  CAL["Calibration set<br/>training split"] --> Q["Qubee compiler<br/>INT8"]
  C --> Q
  Q --> N["Mobilint NPU<br/>MACCEL runtime"]`,
   repo:"edge-vision-npu"},

  {id:"linkedin", title:"LinkedIn Simulation", kind:"Distributed systems", c:"--exp", tag:"Team",
   when:"Apr – May 2026 · distributed systems course",
   lede:"A distributed LinkedIn clone: eight FastAPI microservices on Kafka, Redis, MySQL and MongoDB, with LLM recruiter and career-coach agents. The team benchmarked each layer with JMeter at 100 threads.",
   metrics:[["3×","read throughput from Redis"],["−39%","avg write latency from Kafka"],["+48%","write throughput from 2 replicas"],["~85%","cache hit rate after warm-up"]],
   tradeoffs:[
     {q:"Is a Redis cache worth it for reads?", chose:"Redis, 120 s TTL", cols:["No cache","+ Redis"], pick:1,
      rows:[{m:"Job search throughput", v:[35,105], f:["~35 req/s","~105 req/s"], better:"high"},
            {m:"Job search p95", v:[520,180], f:["~520 ms","~180 ms"], better:"low"},
            {m:"Application submit p95", v:[320,280], f:["~320 ms","~280 ms"], better:"low"}],
      verdict:"Redis is the biggest single win on reads: 3× throughput and p95 down 65%. It barely moves writes.",
      cost:"Readers can see data up to 120 s old, and every write has to invalidate the right key patterns."},
     {q:"Should writes go through Kafka?", chose:"Kafka-first writes with an outbox", cols:["Redis only","+ Kafka"], pick:1,
      rows:[{m:"Submit throughput", v:[68,105], f:["~68 req/s","~105 req/s"], better:"high"},
            {m:"Submit avg latency", v:[140,85], f:["~140 ms","~85 ms"], better:"low"},
            {m:"Job search throughput", v:[105,110], f:["~105 req/s","~110 req/s"], better:"high"}],
      verdict:"The HTTP call returns 202 once the row and the outbox entry commit, so average write latency drops 39% (140 → 85 ms) and p95 drops 43%. Reads gain almost nothing.",
      cost:"Eventual consistency: the UI has to show pending data honestly. Duplicates need idempotency keys plus a UNIQUE constraint."},
     {q:"Scale out with replicas?", chose:"2 replicas behind a Kafka consumer group", cols:["1 instance","2 replicas"], pick:1,
      rows:[{m:"Submit throughput", v:[105,155], f:["~105 req/s","~155 req/s"], better:"high"},
            {m:"Submit p95", v:[160,120], f:["~160 ms","~120 ms"], better:"low"}],
      verdict:"Partitions split across the two consumers, so write throughput rises 48% with no double processing.",
      cost:"In-process caches stop working: every replica needs the shared Redis, or each one serves its own stale view."}],
   stack:["Python","FastAPI","Kafka","Redis","MySQL","MongoDB","React","AWS ECS","JMeter"],
   mermaid:`flowchart LR
  UI["React app"] --> GW["FastAPI services x8"]
  GW -->|"submit.requested"| K[("Kafka")]
  K --> C["Consumer<br/>idempotent write"]
  C --> DB[("MySQL + MongoDB<br/>+ outbox")]
  C -->|"submitted"| K
  K --> AN["Analytics rollups"]
  GW --> R[("Redis cache")]
  GW --> AI["LLM agents"]`,
   repo:"Linkedin_Simulation_LLM_Agent_Microservices"},

  {id:"aki", title:"AKI Trajectory Analysis", kind:"Data engineering", c:"--teal", tag:"Led",
   when:"Apr – May 2026 · big data course, project lead",
   lede:"A pipeline on MIMIC-IV ICU data that stages acute kidney injury with KDIGO rules and scores risk in real time. I led the 5-person team and owned ingestion, the Bronze/Silver layers, the quality gates and the Bloom filter.",
   metrics:[["~0.85","AUROC, gradient-boosted trees"],["1%","Bloom false-positive budget"],["≤1%","creatinine outliers allowed at Bronze"],["ε = 0.5","privacy noise, dashboard only"]],
   tradeoffs:[
     {q:"Deduplicate with an exact set or a Bloom filter?", chose:"Scalable Bloom filter at Silver", cols:["Exact set","Bloom filter"], pick:1,
      rows:[{m:"Memory per 1M keys (estimate)", v:[40,1.2], f:["≥40 MB","~1.2 MB"], better:"low"},
            {m:"Chance a new event is dropped", v:[0,1], f:["0%","≤1%"], better:"low"}],
      verdict:"About 9.6 bits per key at a 1% error rate, against roughly 40+ bytes per key just to store the raw keys. It runs before feature computation, so no downstream table sees a repeat.",
      cost:"Up to 1% of genuinely new events can be flagged as duplicates. In clinical data that's a real cost, which is why the window is capped at 7 days and the filter has its own tests."},
     {q:"Which model goes to production?", chose:"Gradient-boosted trees, with fairness flags", cols:["Logistic regression","GBT"], pick:1,
      rows:[{m:"AUROC", v:[0.78,0.85], f:["~0.78","~0.85"], better:"high"},
            {m:"AUPRC", v:[0.72,0.81], f:["~0.72","~0.81"], better:"high"}],
      verdict:"GBT gains 0.07 AUROC and 0.09 AUPRC over the baseline.",
      cost:"3 of 6 age groups miss the F1/recall ≥ 0.80 bar. Ages 70–79 are worst (F1 0.75, recall 0.72), so they are flagged, not hidden."},
     {q:"Where should privacy noise go?", chose:"Only at the reporting boundary", facts:[
        ["k = 5","k-anonymity with decade age buckets"],["ε = 0.5","Laplace noise on dashboard aggregates"],
        ["0","noise added to training data"],["0.3–15.0","mg/dL creatinine range (was 0.1–20.0)"]],
      verdict:"Models train on full-fidelity data. Only what people see gets anonymised.",
      cost:"Anyone with warehouse access sees raw records, so access control carries more of the load."}],
   stack:["Snowflake","dbt","Great Expectations","Spark","Kafka","MLflow","Python"],
   mermaid:`flowchart LR
  CSV["MIMIC-IV CSVs"] --> BR["Bronze<br/>COPY INTO"]
  BR --> G1{"GX gate 1"}
  G1 --> SV["Silver<br/>dbt timelines"]
  SV --> BF["Bloom filter<br/>7-day dedup"]
  BF --> G2{"GX gate 2"}
  G2 --> GD["Gold<br/>KDIGO + features"]
  GD --> MT["Mart · MLflow"]
  K[("Kafka<br/>labs · vitals · fluids")] --> SP["Spark streaming"]
  SP --> LIVE["Live risk scores"]`,
   repo:"AKI_trajectory_Analysis"},

  {id:"voltwise", title:"VoltWise", kind:"Analytics", c:"--ach",
   when:"Started 2020 · rebuilt Oct 2026",
   lede:"Does a home battery pay for itself on a time-of-use tariff with a demand charge? It's tested on 2 million real meter readings with 2009 held out, and the honest answer is no.",
   metrics:[["53.1%","billed peak cut"],["84%","of the perfect-foresight optimum"],["+$99/yr","from picking the 'worse' forecaster"],["31.9 yr","payback, so it doesn't pay"]],
   tradeoffs:[
     {q:"Pick the forecaster by accuracy or by money saved?", chose:"Seasonal naive, picked by dollars", cols:["GBT (mean)","Seasonal naive","Perfect forecast"], pick:1,
      rows:[{m:"Hourly MAPE", v:[54.2,69.1,0], f:["54.2%","69.1%","0%"], better:"low"},
            {m:"Savings on 2009 (test)", v:[324,423,435], f:["$324","$423","$435"], better:"high"}],
      verdict:"The most accurate model was the worst controller input: a mean forecast smooths away exactly the spikes the battery has to catch. The naive one saves 31% more.",
      cost:"A perfect forecast would add only $12. Forecasting isn't the bottleneck; seeing the whole month is."},
     {q:"How good is a controller that can't see the future?", chose:"Forecast MPC", cols:["Threshold rule","Forecast MPC","Annual LP (bound)"], pick:1,
      rows:[{m:"Annual savings", v:[414.65,422.94,503.71], f:["$414.65","$422.94","$503.71"], better:"high"},
            {m:"Billed peak cut", v:[51.8,53.1,63.0], f:["51.8%","53.1%","63.0%"], better:"high"},
            {m:"Battery throughput", v:[842,950,1441], f:["842 kWh","950 kWh","1,441 kWh"], better:"low"}],
      verdict:"The deployable controller captures 84% of the optimum. Holding the battery for peaks instead of evening arbitrage took the same forecast from $81 to $324 a year.",
      cost:"$81 a year is left on the table. Energy charges rise slightly under every strategy, because round-trip losses outweigh the time-of-use spread."},
     {q:"Does a bigger battery pay back faster?", chose:"No, and smaller is better here", cols:["5 kWh","10 kWh","13.5 kWh","20 kWh"], pick:0,
      rows:[{m:"Savings (forecast MPC)", v:[202,353,423,403], f:["$202","$353","$423","$403"], better:"high"},
            {m:"Payback", v:[24.7,28.4,31.9,49.6], f:["24.7 yr","28.4 yr","31.9 yr","49.6 yr"], better:"low"}],
      verdict:"Savings flatten after 13.5 kWh while cost keeps rising. Savings track the demand charge almost linearly: at $0/kW the battery loses $2 a year.",
      cost:"For this household the battery never pays back. The same engine fits commercial customers with higher demand charges."}],
   stack:["Java","MySQL","Linear programming","Gradient boosting","JUnit"],
   mermaid:`flowchart LR
  M["2M meter readings"] --> AN["Anomaly detection"]
  P["ISO-NE hourly prices"] --> TOU["Time-of-use tariff"]
  AN --> FC["Load forecast<br/>naive vs GBT"]
  FC --> DISP["Battery dispatch<br/>rule · MPC · LP"]
  TOU --> DISP
  DISP --> BILL["Bill + payback"]`,
   repo:"VoltWise"},
];

const JOBS = [
  {when:"Jun 2026 – Aug 2026", where:"Internship", org:"MedLaunch Concepts", role:"Software Engineer Intern – Data/AI", c:"--exp",
   text:"Healthcare accreditation company. I built LLM search over hospital policy documents and the AWS pipelines that feed it.",
   stack:["Python","AWS Lambda","SQS","EventBridge","AWS Glue","MongoDB Atlas","CloudWatch","PyTest","RAG"],
   shipped:[["−60% lookup effort","Clara, a RAG app over 50K+ policy documents, tuned against an evaluation set"],
            ["4–8 s → 1.5–2.5 s","search latency, after tracing Lambda cold starts in CloudWatch"],
            ["22K policies, 0 hard failures","identity-resolution backfill across 5 Lambda services, 20+ PyTest tests"],
            ["−400–550 ms","unmatched-query latency with a Glue ETL into MongoDB Atlas"]]},
  {when:"Jan 2026 – May 2026", where:"San José, CA", org:"San José State University", role:"Instructional Student Assistant, Data Systems Core", c:"--edu",
   text:"Teaching assistant for a graduate data systems course. Explaining concurrency to 30 people is a good test of whether you really understand it.",
   stack:["Distributed systems","Kafka","Linux","Python"],
   shipped:[["30+ students","taught scheduling, deadlocks, concurrent data structures and Kafka architecture"],["Lab guides","and mentoring sessions on Kafka"]]},
  {when:"Jul 2021 – Jul 2025", where:"Mumbai, India", org:"Merkle (Dentsu Group)", c:"--gpu",
   roles:[
     {role:"Software Engineer II", when:"Jun 2023 – Jul 2025", text:"Data-quality and reliability tooling across the pipelines that ran every night, plus Kafka-based backend services."},
     {role:"Software Engineer I", when:"Jul 2021 – May 2023", text:"Data load frameworks and pipeline migrations for enterprise clients on AWS, GCP, Azure and Snowflake."}],
   stack:["Java","Spring Boot","Kafka","SQL Server","Snowflake","Redshift","AWS","GCP","Azure","Kubernetes"],
   shipped:[["2 TB / month reclaimed","with an automated Redshift purge and data-quality framework"],
            ["Incidents 7 → 0","across 80+ daily pipelines"],
            ["38 pipelines migrated","Informatica to SQL Server procedures: −21.33% cost, −18% runtime at 25M rows/day"],
            ["80% of clients","adopted the reusable Data Load Framework"],
            ["Climb High Award","for platform efficiency work and code reviews"]]},
];

const KEYS = {
  crewquarters:["26× faster at 100K chunks, but only 1.4 ms at 10K","15.5 ms refusal vs a 2.24 s load","24.7 s to bring the stack up"],
  gpu:["copies fall from 63% to 19% of GPU time","448 vs 64.3 TFLOPS","27 GB → 0.18 GB, 7.2× faster"],
  npu:["+0.945 dB from 2.66M params; U-Net worse at 4.85M","0 ops fall back to the CPU"],
  linkedin:["~35 → ~105 req/s on reads","−39% average write latency","+48% write throughput"],
  aki:["~1.2 MB vs ≥40 MB per million keys","AUROC ~0.78 → ~0.85, 3 groups flagged","ε = 0.5 on dashboards only"],
  voltwise:["$423 vs $324 saved a year","84% of the optimum","24.7 yr vs 49.6 yr payback"]};
const SHORT = {
  crewquarters:["Exact search vs HNSW","Refuse vs load a model","Compose vs Kubernetes"],
  gpu:["When the GPU wins","FP32 vs FP8","Naive vs fused attention"],
  npu:["plain vs dual vs U-Net","Any op vs NPU-safe ops"],
  linkedin:["No cache vs Redis","Sync vs Kafka writes","1 vs 2 replicas"],
  aki:["Exact set vs Bloom filter","Logistic reg. vs GBT","Where privacy noise goes"],
  voltwise:["Accuracy vs dollars","Rule vs MPC vs LP","Battery size vs payback"]};
PROJECTS.forEach(p => p.tradeoffs.forEach((t,i) => { t.key = (KEYS[p.id]||[])[i] || ""; t.short = (SHORT[p.id]||[])[i] || t.chose; }));

const REPOS = [
  {group:"AI agents and LLMs", note:"RAG backends, agent graphs and model experiments.", items:[
    ["bookstack-mcp","Python","Library app with a RAG backend: LangGraph, pgvector, guardrails, SSE streaming and an MCP server for AI agents."],
    ["Multiagent-LanghGraph","Python","Multi-agent RAG backend with LangGraph, FastAPI and a local FAISS store, with schema contracts and guardrails."],
    ["bikeshare-react-agent","Python","ReAct + MRKL agent that tells a rider whether a bike-share membership beats paying per ride, on a local LLM."],
    ["llm-sentiment-cyclegan-lab","PyTorch","GPT from scratch (1.65M params, perplexity 2.33), Yelp sentiment and CycleGAN style transfer."],
    ["deep-learning-pneumonia-detector","TensorFlow","Chest X-ray classifier comparing VGG16, VGG19 and ResNet50 transfer learning, with a PyQt5 app."]]},
  {group:"Data and streaming", note:"Pipelines, from Kafka streams to serverless SQL.", items:[
    ["realtime-crypto-pipeline","Python","Kafka producer, Spark Structured Streaming, Hive storage and an Elasticsearch/Kibana dashboard."],
    ["Medlaunch-pipeline","Python","Athena SQL + boto3 on S3 with an audit log for every run, deployed with CloudFormation."],
    ["Crime-Data-Analysis","Alteryx","Workflow that extracts, transforms and visualizes crime data."]]},
  {group:"Backend and early work", note:"APIs, and the apps I learned on.", items:[
    ["fastapi-blog-rbac","Python","FastAPI blog API with JWT auth and role-based access (reader, writer, moderator)."],
    ["book-management-fastapi-react","Python","Book management app with a FastAPI backend and a React front end."],
    ["Stackoverflow","PHP","An early Stack Overflow clone in PHP and MySQL."]]},
];

const MILESTONES = [
  {ic:"🥇", c:"--ach", t:"1st prize, Study Link Hackathon", d:"Led a team of 4 from problem to shipped prototype in 12 hours."},
  {ic:"❄️", c:"--exp", t:"SnowPro Core Certified", d:'Snowflake architecture, warehousing and governance. <a href="https://achieve.snowflake.com/4d9320ea-6b52-4d88-afc7-125bd9a4cecf" target="_blank" rel="noopener">Credential</a>'},
  {ic:"🧗", c:"--gpu", t:"Climb High Award, Merkle", d:"For platform efficiency work and peer code reviews."},
  {ic:"🛠️", c:"--orange", t:"DeleteDB Hackathon", d:"Where CrewQuarters started, built in two days."},
  {ic:"🤖", c:"--edu", t:"Agentic Data Bootcamp, Ascend.io", d:"Agentic data engineering and analytics labs."},
];

// ---------------- render ----------------
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
document.documentElement.classList.add("js");
$("#year").textContent = new Date().getFullYear();

$("#stats").innerHTML = STATS.map(s => `<li class="stat fade" style="--c:var(${s.c})"><b>${s.b}</b><span>${s.s}</span><small>${s.m}</small></li>`).join("");

// ---------- why / what / action (plain-language layer for a hiring manager) ----------
const STORY = {
  crewquarters:{
    why:"Cloud AI agents need your files and credentials to leave your machine. Owners of an NVIDIA GB10 / DGX Spark box had no simple, safe way to run agents locally instead.",
    what:"A self-hosted AI-agent platform: serves open-weight LLMs with vLLM, runs each agent in a sandboxed container, answers from your documents with citations, and installs offline from one .deb.",
    actions:["Shipped exact cosine search in pgvector, then benchmarked it against an HNSW index at 10K and 100K chunks before adding one.",
             "Built an admission controller that checks free memory, model size and KV-cache budget before loading, and unloads idle models after 10 minutes.",
             "Packaged every service as Docker Compose inside one offline installer, and load-tested the stack on a laptop."]},
  gpu:{
    why:"Spec sheets give peak numbers. I wanted to know what a GPU actually delivers on real workloads, and be able to explain the gap.",
    what:"A hand-written CUDA C matrix multiply profiled on a Tesla T4, plus an RTX 5090 study: roofline, every precision from FP32 to FP8, naive vs fused attention, and a 20-minute thermal run.",
    actions:["Timed the kernel and the host↔device copies separately with CUDA events and nvprof at N = 256, 1024 and 4096, checking every result against a CPU loop.",
             "Swept GEMM sizes in FP32, TF32, FP16, BF16 and FP8 on the RTX 5090.",
             "Ran naive and fused attention from 512 to 32,768 tokens, and found the out-of-memory point to the exact token with GPU memory capped."]},
  npu:{
    why:"Edge devices can't run big FP32 models. To put vision on a low-power NPU, a model has to survive conversion to 8-bit integers without losing what it learned.",
    what:"Two vision models trained from scratch in PyTorch (a 20-class classifier and an image-restoration network), exported to ONNX and compiled to INT8 for a Mobilint NPU.",
    actions:["Trained three restoration designs on an identical budget (3,000 steps, same loss, crops and batch) and compared quality, size and training time.",
             "Limited the network to 5 operator types the NPU runs natively, started it as an exact identity, and checked that ONNX Runtime matches PyTorch."]},
  linkedin:{
    why:"A job platform is read-heavy for search and write-heavy for applications. The course goal was to keep both fast at 100 concurrent users and show which layer earns its complexity.",
    what:"A LinkedIn-style platform built by a team of 8: eight FastAPI microservices on Kafka, Redis, MySQL and MongoDB, a React app, and LLM recruiter and career-coach agents.",
    actions:["Added Redis caches with a 120 s TTL and invalidation on writes, and measured each layer with JMeter at 100 threads.",
             "Moved writes to a transactional outbox: the API commits the row and an outbox entry, returns 202, and a dispatcher publishes to Kafka.",
             "Ran 2 replicas in one Kafka consumer group, with idempotency keys and a UNIQUE constraint so no application is written twice."]},
  aki:{
    why:"Acute kidney injury in ICU patients is staged from lab values. A real-time risk score is only as trustworthy as the deduplicated, validated data that feeds it.",
    what:"A pipeline on MIMIC-IV ICU data that stages kidney injury with KDIGO rules and scores risk in real time. I led the 5-person team and owned ingestion, the quality gates and deduplication.",
    actions:["Built a scalable Bloom filter (1% error budget, 7-day window) on each event's subject, time, type and value, with its own tests, in front of feature computation.",
             "The team trained a logistic-regression baseline and gradient-boosted trees, tracked both in MLflow, and checked F1 and recall per age group.",
             "Applied k-anonymity and Laplace noise to dashboard aggregates only, and tightened the valid creatinine range at the first quality gate."]},
  voltwise:{
    why:"Home batteries are sold on the promise of lower bills. I wanted to test that promise on real meter data, under a tariff with a demand charge.",
    what:"A Java analytics engine that forecasts household load, dispatches a battery to cut the monthly peak, and prices the result against real ISO New England prices. It started in 2020 as a bill generator.",
    actions:["Plugged 7 forecasters into the controller, scored each on dollars saved in 2008, and tested the winner on held-out 2009.",
             "Built a threshold rule, a forecast-driven MPC and a perfect-foresight linear program, and ran all three on the same held-out year.",
             "Swept battery sizes from 5 to 20 kWh and demand charges from $0 to $25 per kW."]},
};
PROJECTS.forEach(p => { const s = STORY[p.id]; p.why = s.why; p.what = s.what; p.tradeoffs.forEach((t,i) => t.action = s.actions[i] || ""); });

// ---------- project buttons + compact panel ----------
const tabs = $("#tabs"), caseEl = $("#case");
let currentProject = PROJECTS[0].id;
tabs.innerHTML = PROJECTS.map(p => `<button type="button" class="proj" data-id="${p.id}" style="--c:var(${p.c})" aria-controls="case" aria-pressed="false"><i aria-hidden="true"></i>${esc(p.title)}</button>`).join("");

function showProject(id){
  const p = PROJECTS.find(x => x.id === id) || PROJECTS[0];
  currentProject = p.id;
  tabs.querySelectorAll(".proj").forEach(b => b.setAttribute("aria-pressed", b.dataset.id === p.id));
  caseEl.style.setProperty("--c", `var(${p.c})`);
  caseEl.innerHTML = `<div class="case-anim">
    <header class="pn-head">
      <div>
        <p class="pn-meta mono">${esc(p.kind)}${p.tag ? ` · ${p.tag}` : ""} · ${esc(p.when)}</p>
        <h3>${esc(p.title)}</h3>
      </div>
      <div class="pn-actions">
        <button type="button" class="pn-btn" id="arch-btn" aria-expanded="false" aria-controls="arch">Architecture</button>
        <a class="pn-btn" href="${GH(p.repo)}#readme" target="_blank" rel="noopener">README ↗</a>
      </div>
    </header>
    <div class="arch-pane" id="arch" hidden><a class="arch-img" href="assets/arch-${p.id}.svg" target="_blank" rel="noopener" title="Open full size"><img src="assets/arch-${p.id}.svg" alt="Architecture diagram of ${esc(p.title)}, from its GitHub README" loading="lazy"></a><p class="arch-note">From the README on GitHub · <a href="assets/arch-${p.id}.svg" target="_blank" rel="noopener">open full size ↗</a></p></div>
    <div class="ww">
      <p><span class="lbl">Why</span>${esc(p.why)}</p>
      <p><span class="lbl">What</span>${esc(p.what)}</p>
    </div>
    <p class="pn-sub mono">Trade-offs</p>
    <ol class="tlist">${p.tradeoffs.map(tradeoffHTML).join("")}</ol>
    <p class="pn-foot muted">Stack: ${p.stack.map(esc).join(" · ")}</p>
  </div>`;
  const btn = $("#arch-btn"), pane = $("#arch");
  btn.addEventListener("click", () => {
    const open = pane.hidden; pane.hidden = !open; btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "Hide architecture" : "Architecture";
  });
}
function tradeoffHTML(t){
  let body = "";
  if (t.rows){
    const n = t.cols.length;
    body = `<div class="cmp" style="--n:${n}" role="table" aria-label="${esc(t.q)}">
      <div class="cmp-row cmp-head" role="row"><span role="columnheader"></span>${t.cols.map((c,k) => `<span role="columnheader" class="${k===t.pick ? "picked" : ""}">${esc(c)}${k===t.pick ? " ✓" : ""}</span>`).join("")}</div>
      ${t.rows.map(r => {
        const max = Math.max(...r.v.map(Math.abs)) || 1;
        const best = r.better === "none" ? -1 : r.v.indexOf(r.better === "low" ? Math.min(...r.v) : Math.max(...r.v));
        return `<div class="cmp-row" role="row"><span class="cmp-m" role="rowheader">${esc(r.m)}</span>${r.v.map((v,k) => `<span role="cell" class="cell${k===best ? " best" : ""}${k===t.pick ? " pickcol" : ""}"><i style="width:${Math.max(2, Math.abs(v)/max*100).toFixed(1)}%"></i><b>${esc(r.f[k])}</b></span>`).join("")}</div>`;
      }).join("")}
    </div>`;
  } else {
    body = `<div class="facts">${t.facts.map(([b,s]) => `<div><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join("")}</div>`;
  }
  return `<li class="t-item">
    <p class="t-q">${esc(t.q)}</p>
    <p class="t-line"><span class="lbl">Decision</span><b>${esc(t.chose)}</b></p>
    <p class="t-line"><span class="lbl">Action</span>${esc(t.action)}</p>
    <p class="t-line"><span class="lbl">Result</span><span class="t-key">${esc(t.key)}</span></p>
    <details class="t-more"><summary>See the numbers</summary>${body}<p class="t-line"><span class="lbl">Why</span>${esc(t.verdict)}</p><p class="t-line cost"><span class="lbl">Cost</span>${esc(t.cost)}</p></details>
  </li>`;
}
tabs.addEventListener("click", e => { const b = e.target.closest(".proj"); if (b){ showProject(b.dataset.id); history.replaceState(null, "", "#work/" + b.dataset.id); } });
const fromHash = (location.hash.match(/^#work\/(.+)$/) || [])[1];
showProject(fromHash || PROJECTS[0].id);
if (fromHash) setTimeout(() => $("#work").scrollIntoView(), 50);

// experience
$("#timeline").innerHTML = JOBS.map(j => `<li class="job fade" style="--c:var(${j.c})">
  <div class="job-when"><b>${esc(j.when)}</b>${esc(j.where)}</div>
  <div class="job-main">
    <h3>${esc(j.org)}</h3>
    ${j.roles ? j.roles.map((r,i) => `<div class="${i ? "sub-role" : ""}"><p class="role">${esc(r.role)} <span class="mono muted" style="font-size:12px">· ${esc(r.when)}</span></p><p>${esc(r.text)}</p></div>`).join("")
              : `<p class="role">${esc(j.role)}</p><p>${esc(j.text)}</p>`}
    <div class="stack">${j.stack.map(s => `<span>${esc(s)}</span>`).join("")}</div>
  </div>
  <div class="shipped"><p class="lbl">Shipped · ${String(j.shipped.length).padStart(2,"0")}</p><ul>${j.shipped.map(([b,s]) => `<li><b>${esc(b)}</b>${esc(s)}</li>`).join("")}</ul></div>
</li>`).join("");

// repos
$("#repos").innerHTML = REPOS.map(g => `<div class="repo-group fade"><h3>${esc(g.group)}</h3><p>${esc(g.note)}</p><div class="repo-grid">${
  g.items.map(([n,l,d]) => `<a class="repo" href="${GH(n)}" target="_blank" rel="noopener"><span class="top"><b>${esc(n)}</b><span class="lang">${esc(l)}</span></span><p>${esc(d)}</p></a>`).join("")}</div></div>`).join("");

// milestones (descriptions contain trusted, hand-written links)
$("#milestones").innerHTML = MILESTONES.map(m => `<li class="ms fade" style="--c:var(${m.c})"><span class="ic" aria-hidden="true">${m.ic}</span><div><b>${esc(m.t)}</b><p>${m.d}</p></div></li>`).join("");

// nav state + reveal on scroll
const nav = $("#nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), {passive:true});
const links = [...document.querySelectorAll(".nav nav a")];
if ("IntersectionObserver" in window){
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {rootMargin:"0px 0px -8% 0px"});
  document.querySelectorAll(".fade").forEach(el => io.observe(el));
  const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); }), {rootMargin:"-45% 0px -50% 0px"});
  ["work","experience","map","contact"].forEach(id => so.observe(document.getElementById(id)));
} else document.querySelectorAll(".fade").forEach(el => el.classList.add("in"));
