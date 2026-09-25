import AVFoundation
import Accelerate
let a = CommandLine.arguments, out = URL(fileURLWithPath: a[1]), W = Int(a[2])!, H = Int(a[3])!, FPS = Int32(a[4])!
try? FileManager.default.removeItem(at: out)
let wr = try! AVAssetWriter(outputURL: out, fileType: .mp4)
let inp = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoColorPropertiesKey: [AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2, AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2, AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2],
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 40_000_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoMaxKeyFrameIntervalKey: Int(FPS), AVVideoExpectedSourceFrameRateKey: Int(FPS)]])
inp.expectsMediaDataInRealTime = false
let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: inp, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
wr.add(inp); wr.startWriting(); wr.startSession(atSourceTime: .zero)
let n = W * H * 4, buf = UnsafeMutablePointer<UInt8>.allocate(capacity: n)
var i: Int64 = 0
func readFrame() -> Bool { var got = 0; while got < n { let r = read(0, buf + got, n - got); if r <= 0 { return false }; got += r }; return true }
while readFrame() {
  var pb: CVPixelBuffer?; CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &pb); let p = pb!
  CVPixelBufferLockBaseAddress(p, [])
  var s = vImage_Buffer(data: buf, height: vImagePixelCount(H), width: vImagePixelCount(W), rowBytes: W * 4)
  var d = vImage_Buffer(data: CVPixelBufferGetBaseAddress(p), height: vImagePixelCount(H), width: vImagePixelCount(W), rowBytes: CVPixelBufferGetBytesPerRow(p))
  vImagePermuteChannels_ARGB8888(&s, &d, [2, 1, 0, 3], vImage_Flags(kvImageNoFlags))
  CVPixelBufferUnlockBaseAddress(p, [])
  while !inp.isReadyForMoreMediaData { usleep(1000) }
  if !ad.append(p, withPresentationTime: CMTime(value: i, timescale: FPS)) { print("append failed", wr.error as Any); exit(1) }
  i += 1
}
inp.markAsFinished()
let sem = DispatchSemaphore(value: 0); wr.finishWriting { sem.signal() }; sem.wait()
print("frames", i, "status", wr.status.rawValue, wr.error as Any)
